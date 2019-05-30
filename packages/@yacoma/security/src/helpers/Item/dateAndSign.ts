import * as crypt from '@yacoma/crypt'
import {
  AccessChangeLogEntry,
  AccessChangeOperation,
  CollectionAccess,
  CollectionUserAccess,
  Item,
  RawUserWithKeys,
  UserAccess,
} from '../../types'
import { remoteNow } from '../time'
import { getSignature } from './signature'

const STAMP_DATES: ('createdAt' | 'editedAt' | 'accessChangedAt')[] = [
  'createdAt',
  'editedAt',
  'accessChangedAt',
]

export function getAccessChanges(
  oldAccess: UserAccess | CollectionAccess,
  newAccess: UserAccess | CollectionAccess
) {
  const oldIds = Object.keys(oldAccess)
  const newIds = Object.keys(newAccess)
  const add = newIds.filter(k => !oldAccess[k])
  const remove = oldIds.filter(k => !newAccess[k])
  const update = newIds.filter(
    k =>
      oldAccess[k] &&
      JSON.stringify(newAccess[k]) !== JSON.stringify(oldAccess[k])
  )
  return { add, update, remove }
}

async function updateAccessChangeLog(
  type: 'user' | 'collection',
  currentUser: RawUserWithKeys,
  now: number,
  // Old item
  oldItem: Item,
  // New userAccess
  newItem: Item
) {
  // collectionAccess: Item belongs to collections
  // userAccess: Item can be edited by users
  const newAccess =
    type === 'user' ? newItem.userAccess : newItem.collectionAccess
  const oldAccess =
    (type === 'user' ? oldItem.userAccess : oldItem.collectionAccess) || {} // non-existant for new items
  const ops = getAccessChanges(oldAccess, newAccess)

  // Create accessLog entries
  let previous = oldItem.id
  let accessChangeLog: AccessChangeLogEntry[] = []
  if (newItem.accessChangeLog) {
    accessChangeLog = newItem.accessChangeLog.slice()
    const last = accessChangeLog.slice(-1)[0]
    if (last) {
      const { signature } = crypt.extractHeader(last.operation)
      previous = crypt.bufferToBase64(signature)
    }
  }
  newItem.accessChangeLog = accessChangeLog

  const opsKeys = Object.keys(ops) as (keyof typeof ops)[]
  for (let i = 0; i < opsKeys.length; i++) {
    const opType = opsKeys[i]
    const ids = ops[opType]
    for (let j = 0; j < ids.length; j++) {
      const id = ids[j]
      const value = newAccess[id]
      const op: AccessChangeOperation = {
        // Changed timestamp.
        changedAt: now,
        // Signature of previous operation. Contains itemId for first operation.
        previous,
        // Type of access operation.
        type,
        // Concerned field in userAccess or collectionAccess.
        id,
        // Operation name.
        operation: opType,
      }

      if (type === 'user' && opType !== 'remove') {
        const val = value as CollectionUserAccess['id']
        // Changed access.
        op.access = val.access
        if (opType === 'add' && val.invite) {
          op.operation = 'invite'
        } else if (currentUser.id === id && newItem.creator !== id) {
          op.operation = 'join'
        }
      }

      const signedOperation = await crypt.sign(currentUser.signKey, op)
      previous = crypt.bufferToBase64(
        crypt.extractHeader(signedOperation).signature
      )
      accessChangeLog.push({
        changedBy: currentUser.id,
        operation: signedOperation,
      })
    }
  }
}

async function updateSignature(currentUser: RawUserWithKeys, item: Item) {
  item.signature = await getSignature(currentUser.signKey, item)
}

/** Before sending an updated (or new) element to the server,
 * we add the dates in ISO format and update the accessChangeLog. By
 * adding just before send, we ensure that the dates are close
 * to `savedAt`. If the dates are too far, we have to send the item
 * again and this helps sign the changes. Having the `original` on
 * items with unsynced content helps in case of conflict.
 * The signature of the item is stored in `signature`.
 */
export async function dateAndSign(
  currentUser: RawUserWithKeys,
  item: Item
): Promise<Item> {
  if (!item.original) {
    throw new Error(`Cannot save unchanged item (missing 'original' field).`)
  }

  const newItem = Object.assign({}, item)
  delete newItem.original

  const now = remoteNow()
  const nowISOString = new Date(now).toISOString()
  STAMP_DATES.forEach(k => {
    if (newItem[k] === '') {
      newItem[k] = nowISOString
    }
  })

  if (
    JSON.stringify(newItem.userAccess) !==
    JSON.stringify(item.original.userAccess)
  ) {
    await updateAccessChangeLog(
      'user',
      currentUser,
      now,
      item.original,
      newItem
    )
  }

  if (
    JSON.stringify(newItem.collectionAccess) !==
    JSON.stringify(item.original.collectionAccess)
  ) {
    await updateAccessChangeLog(
      'collection',
      currentUser,
      now,
      item.original,
      newItem
    )
  }

  await updateSignature(currentUser, newItem)

  return newItem
}
