import * as crypt from '@yacoma/crypt'
import { timeSkewCheck } from '../../helpers'
import {
  AccessChangeLogEntry,
  AccessChangeOperation,
  Base,
  CollectionAccessWithOperation,
  Context,
  Item,
  UserAccessWithOperation,
} from '../../types'

async function parseAccessLogEntries(
  currentUser: Base,
  now: number,
  startIdx: number,
  previousSignature: string,
  newEntries: AccessChangeLogEntry[]
): Promise<(AccessChangeOperation | string)[]> {
  let previous = previousSignature
  const results = []
  for (let idx = 0; idx < newEntries.length; ++idx) {
    const entry = newEntries[idx]
    if (entry.changedBy !== currentUser.id) {
      results.push(
        `entry ${startIdx + idx} changedBy does not match current user (${
          entry.changedBy
        } !== ${currentUser.id}).`
      )
      continue
    }
    let op: AccessChangeOperation | undefined
    try {
      const { payload } = await crypt.verifyAndParse<AccessChangeOperation>(
        currentUser.id,
        entry.operation
      )
      op = payload
    } catch (e) {
      results.push(`entry ${startIdx + idx} is not signed by current user`)
    }
    if (!op) {
      continue
    }
    if (op.previous !== previous) {
      results.push(
        `entry ${startIdx +
          idx} does not contain valid previous signature (found ${JSON.stringify(
          op.previous
        )} but expected ${JSON.stringify(previous)})`
      )
      continue
    }
    previous = crypt.bufferToBase64(
      crypt.extractHeader(entry.operation).signature
    )
    const dateError = timeSkewCheck(now, undefined, op.changedAt)
    if (dateError) {
      results.push('date ' + dateError)
      continue
    }
    if (op.type === 'collection' && op.access) {
      results.push(`collection operation type cannot contain an 'access' entry`)
      continue
    }
    results.push(op)
  }
  return results
}

export async function accessChangeLog({
  now,
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  const { accessChangeLog } = newRecord
  const oldAccessChangeLog = oldRecord ? oldRecord.accessChangeLog : []
  const last = oldAccessChangeLog.slice(-1)[0]
  for (let idx = 0; idx < oldAccessChangeLog.length; ++idx) {
    const oldEntry = oldAccessChangeLog[idx]
    const newEntry = accessChangeLog[idx]
    if (
      newEntry.changedBy !== oldEntry.changedBy ||
      newEntry.operation !== oldEntry.operation
    ) {
      return `accessChangeLog: existing entry ${idx} cannot be modified`
    }
  }

  const previous = last
    ? crypt.bufferToBase64(crypt.extractHeader(last.operation).signature)
    : newRecord.id
  const newEntries = accessChangeLog.slice(oldAccessChangeLog.length)
  const logEntries = await parseAccessLogEntries(
    currentUser,
    now,
    oldAccessChangeLog.length,
    previous,
    newEntries
  )
  const previousUserAccess = oldRecord
    ? oldRecord.userAccess
      ? oldRecord.userAccess
      : {}
    : {}
  const previousCollectionAccess = oldRecord
    ? oldRecord.collectionAccess
      ? oldRecord.collectionAccess
      : {}
    : {}

  // Verify that log content reflects userAccess and collectionAccess changes...
  const userAccess: UserAccessWithOperation = Object.assign(
    {},
    previousUserAccess
  )
  const collectionAccess: CollectionAccessWithOperation = Object.assign(
    {},
    previousCollectionAccess
  )
  for (let idx = 0; idx < logEntries.length; ++idx) {
    const operation = logEntries[idx]
    if (typeof operation === 'string') {
      // Error in parseAccessChangeLog
      return `accessChangeLog: ${operation}`
    }
    // replay entries
    if (operation.type === 'user') {
      if (operation.operation === 'remove') {
        userAccess[operation.id] = {
          operation,
        }
      } else if (operation.operation === 'add') {
        if (userAccess[operation.id]) {
          return `accessChangeLog: cannot 'add' existing access for '${
            operation.id
          }'`
        }
        userAccess[operation.id] = {
          access: operation.access,
          operation,
        }
      } else if (operation.operation === 'update') {
        if (!userAccess[operation.id]) {
          return `accessChangeLog: cannot 'update' without an existing access for '${
            operation.id
          }'`
        }

        if (userAccess[operation.id].access === operation.access) {
          return `accessChangeLog: invalid 'update' operation for '${
            operation.id
          }': access hasn't changed`
        }

        userAccess[operation.id] = {
          access: operation.access,
          operation,
        }
      } else if (operation.operation === 'invite') {
        if (userAccess[operation.id]) {
          return `accessChangeLog: 'invite' entry already exists for '${
            operation.id
          }'`
        }
        userAccess[operation.id] = {
          access: operation.access,
          operation,
        }
      } else if (operation.operation === 'join') {
        if (!userAccess[operation.id]) {
          return `accessChangeLog: cannot 'join' without an existing invite for '${
            operation.id
          }'`
        }
        userAccess[operation.id] = {
          access: operation.access,
          operation,
        }
      }
    } else if (operation.type === 'collection') {
      if (operation.operation === 'remove') {
        collectionAccess[operation.id] = {
          operation,
        }
      } else if (operation.operation === 'add') {
        if (collectionAccess[operation.id]) {
          return `accessChangeLog: cannot 'add' existing key for '${
            operation.id
          }'`
        }
        collectionAccess[operation.id] = {
          operation,
        }
      } else {
        return `accessChangeLog: operation '${
          operation.operation
        }' is not allowed for 'collection' type`
      }
    }
  }

  // Deleted entry without log entry
  const deletedUserAccess = Object.keys(previousUserAccess).filter(
    k => !newRecord.userAccess[k]
  )
  for (const id of deletedUserAccess) {
    const access = userAccess[id]
    if (!access || access.operation === undefined) {
      return `accessChangeLog: missing entry for removed user access '${id}'`
    } else if (access.operation.operation !== 'remove') {
      return `accessChangeLog: wrong entry '${
        access.operation.operation
      }' for removed user access '${id}'`
    }
  }

  const deletedCollectionAccess = Object.keys(previousCollectionAccess).filter(
    k => !newRecord.collectionAccess[k]
  )
  for (const id of deletedCollectionAccess) {
    const access = collectionAccess[id]
    if (!access || access.operation === undefined) {
      return `accessChangeLog: missing entry for removed collection access '${id}'`
    } else if (access.operation.operation !== 'remove') {
      return `accessChangeLog: wrong entry '${
        access.operation.operation
      }' for removed collection access '${id}'`
    }
  }

  // Compare
  for (const id in newRecord.userAccess) {
    const logEntry = userAccess[id]
    const newEntry = newRecord.userAccess[id]

    if (newEntry && !logEntry) {
      return `accessChangeLog: missing entry for new user access '${id}'`
    }

    if (newEntry.access !== logEntry.access) {
      return `accessChangeLog: invalid entry for '${id}' (log access '${
        logEntry.access
      }' does not match '${newEntry.access}')`
    }
  }

  for (const id in newRecord.collectionAccess) {
    const logEntry = collectionAccess[id]
    const newEntry = newRecord.collectionAccess[id]

    if (newEntry && !logEntry) {
      return `accessChangeLog: missing entry for new collection access '${id}'`
    }
  }
}
