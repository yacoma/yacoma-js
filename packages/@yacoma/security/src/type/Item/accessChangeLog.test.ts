import { bufferToBase64, extractHeader, sign } from '@yacoma/crypt'
import * as helpers from '../../helpers'
import {
  FUTURE_LEEWAY,
  FUTURE_MESSAGE,
  PAST_LEEWAY,
  PAST_MESSAGE,
} from '../../helpers/time'
import {
  AccessChangeLogEntry,
  AccessChangeOperation,
  CollectionUserAccess,
  Item,
  itemAccessValue,
  UserAccess,
  UserWithKeys,
} from '../../types'
import * as validate from './'

let user1: UserWithKeys
let user2: UserWithKeys
const now = Date.now()

const operation1: AccessChangeOperation = {
  changedAt: now,
  previous: 'itemId',
  type: 'user',
  id: 'userId',
  operation: 'add',
  access: itemAccessValue.admin,
}

const operation2: AccessChangeOperation = {
  changedAt: now,
  previous: '',
  type: 'user',
  id: 'otherId',
  operation: 'add',
  access: itemAccessValue.editor,
}

const inviteOperation: AccessChangeOperation = {
  changedAt: now,
  previous: '',
  type: 'user',
  id: 'invitedId',
  operation: 'invite',
  access: itemAccessValue.editor,
}

const operation3: AccessChangeOperation = {
  changedAt: now,
  previous: '',
  type: 'user',
  id: 'otherId',
  operation: 'update',
  access: itemAccessValue.editor,
}

const addExisting: AccessChangeOperation = {
  changedAt: now,
  previous: '',
  type: 'user',
  id: 'userId',
  operation: 'add',
  access: itemAccessValue.admin,
}

const badOperation2: AccessChangeOperation = {
  changedAt: now,
  previous: '',
  type: 'user',
  id: 'otherId',
  operation: 'add',
  access: itemAccessValue.admin,
}

const removeOp: AccessChangeOperation = {
  changedAt: now,
  previous: 'itemId',
  type: 'user',
  id: 'otherId',
  operation: 'remove',
}

const badRemoveOp: AccessChangeOperation = {
  changedAt: now,
  previous: 'itemId',
  type: 'user',
  id: 'otherId',
  operation: 'update',
}

let signedRemoveOp: string
let signedBadRemoveOp: string
const userAccess: UserAccess = {
  userId: {
    access: itemAccessValue.admin,
  },

  otherId: {
    access: itemAccessValue.editor,
  },
}
let signedOperation1: string
let signedOperation12: string
let signedOperation2: string
let signedAddExisting: string
let signedOperation3: string
let signedOperation31: string
let signedBadOperation2: string
let signedInviteOperation: string
let previous: string

describe('accessChangeLog', () => {
  beforeAll(async () => {
    const wordList1 = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    user1 = await helpers.userFromWordList(wordList1)
    const wordList2 = [
      'dangerous',
      'gorilla',
      'nowhere',
      'laptop',
      'iceberg',
      'tomorrow',
    ]
    user2 = await helpers.userFromWordList(wordList2)
    signedOperation1 = await sign(user1.signKey, operation1)
    signedOperation12 = await sign(user2.signKey, operation1)
    previous = bufferToBase64(extractHeader(signedOperation1).signature)

    operation2.previous = previous
    signedOperation2 = await sign(user1.signKey, operation2)
    addExisting.previous = previous
    signedAddExisting = await sign(user1.signKey, addExisting)

    badOperation2.previous = previous
    signedBadOperation2 = await sign(user1.signKey, badOperation2)

    operation3.previous = previous
    signedOperation31 = await sign(user1.signKey, operation3)

    const op2signature = bufferToBase64(
      extractHeader(signedOperation2).signature
    )
    operation3.previous = op2signature
    signedOperation3 = await sign(user1.signKey, operation3)

    inviteOperation.previous = op2signature
    signedInviteOperation = await sign(user1.signKey, inviteOperation)

    removeOp.previous = previous
    signedRemoveOp = await sign(user1.signKey, removeOp)
    badRemoveOp.previous = previous
    signedBadRemoveOp = await sign(user1.signKey, badRemoveOp)
  })

  it('should pass on valid access log', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOperation2,
      },
      {
        changedBy: user1.id,
        operation: signedInviteOperation,
      },
    ]
    const userAccessWithInvite: CollectionUserAccess = Object.assign(
      {},
      userAccess,
      {
        invitedId: {
          access: itemAccessValue.editor,
          invite: '',
        },
      }
    )
    const newRecord = {
      id: 'itemId',
      accessChangeLog,
      userAccess: userAccessWithInvite,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(undefined)
  })

  it('should contain log entries for every access', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
    ]
    const newRecord = { id: 'itemId', accessChangeLog, userAccess } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`accessChangeLog: missing entry for new user access 'otherId'`)
  })

  it('should contain log entries for removed access', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
    ]
    const newAccess: UserAccess = {
      userId: {
        access: itemAccessValue.admin,
      },
    }
    const oldRecord = { id: 'itemId', accessChangeLog, userAccess } as Item
    const newRecord = {
      id: 'itemId',
      accessChangeLog,
      userAccess: newAccess,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`accessChangeLog: missing entry for removed user access 'otherId'`)
  })

  it('should contain correct log entry for removed access', async () => {
    const accessChangeLog1: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
    ]

    const accessChangeLog2: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedRemoveOp,
      },
    ]

    const accessChangeLog3: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedBadRemoveOp,
      },
    ]

    const newAccess: UserAccess = {
      userId: { access: itemAccessValue.admin },
    }
    const oldRecord = {
      id: 'itemId',
      accessChangeLog: accessChangeLog1,
      userAccess,
    } as Item

    const args1 = {
      id: 'itemId',
      accessChangeLog: accessChangeLog2,
      userAccess: newAccess,
    } as Item

    const args2 = {
      id: 'itemId',
      accessChangeLog: accessChangeLog3,
      userAccess: newAccess,
    } as Item

    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord: args1,
      })
    ).toBe(undefined)
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord: args2,
      })
    ).toBe(
      `accessChangeLog: wrong entry 'update' for removed user access 'otherId'`
    )
  })

  it('should contain valid access value', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedBadOperation2,
      },
    ]

    const newRecord = { id: 'itemId', userAccess, accessChangeLog } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(
      `accessChangeLog: invalid entry for 'otherId' (log access 'ae' does not match 'e')`
    )
  })

  it('should not contain update entry for unchanged access', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOperation2,
      },
    ]

    const accessChangeLog2: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOperation2,
      },
      {
        changedBy: user1.id,
        operation: signedOperation3,
      },
    ]

    const oldRecord = { id: 'itemId', userAccess, accessChangeLog } as Item
    const newRecord = {
      id: 'itemId',
      userAccess,
      accessChangeLog: accessChangeLog2,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(
      `accessChangeLog: invalid 'update' operation for 'otherId': access hasn't changed`
    )
  })

  it('should not add existing entry', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedAddExisting,
      },
    ]
    const newRecord = { id: 'itemId', accessChangeLog, userAccess } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`accessChangeLog: cannot 'add' existing access for 'userId'`)
  })

  it('should not update new entry', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
    ]
    const accessChangeLog2: AccessChangeLogEntry[] = [
      ...accessChangeLog,
      {
        changedBy: user1.id,
        operation: signedOperation31,
      },
    ]
    const userAccess1: UserAccess = {
      userId: { access: itemAccessValue.admin },
    }
    const oldRecord = {
      id: 'itemId',
      accessChangeLog,
      userAccess: userAccess1,
    } as Item
    const newRecord = {
      id: 'itemId',
      accessChangeLog: accessChangeLog2,
      userAccess,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(
      `accessChangeLog: cannot 'update' without an existing access for 'otherId'`
    )
  })

  it('should contain changedAt date not older then 12 seconds', async () => {
    const signedOp2 = await sign(
      user1.signKey,
      Object.assign({}, operation2, { changedAt: now - PAST_LEEWAY - 1 })
    )
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOp2,
      },
    ]
    const newRecord = {
      id: 'itemId',
      accessChangeLog,
      userAccess,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`accessChangeLog: date ${PAST_MESSAGE}`)
  })

  it('should not contain changedAt date too far in the future', async () => {
    const signedOp2 = await sign(
      user1.signKey,
      Object.assign({}, operation2, { changedAt: now + FUTURE_LEEWAY + 1 })
    )
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOp2,
      },
    ]
    const newRecord = {
      id: 'itemId',
      accessChangeLog,
      userAccess,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`accessChangeLog: date ${FUTURE_MESSAGE}`)
  })

  it('should contain signature for previous entry', async () => {
    const signedOp = await sign(
      user1.signKey,
      Object.assign(operation2, {
        previous: 'bad',
      })
    )
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: user1.id,
        operation: signedOp,
      },
    ]
    const newRecord = { id: 'itemId', accessChangeLog } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(
      `accessChangeLog: entry 1 does not contain valid previous signature (found "bad" but expected "${previous}")`
    )
  })

  it('should set changedBy to current user for new entries', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: 'otherId',
        operation: signedOperation2,
      },
    ]
    const newRecord = { id: 'itemId', accessChangeLog } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toContain(
      `accessChangeLog: entry 1 changedBy does not match current user (otherId !== `
    )
  })

  it('should sign with current user', async () => {
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation12,
      },
      {
        changedBy: 'otherId',
        operation: signedOperation2,
      },
    ]
    const newRecord = { id: 'itemId', accessChangeLog } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`accessChangeLog: entry 0 is not signed by current user`)
  })

  it('should reject modified entries', async () => {
    const accessChangeLog1: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: 'otherId',
        operation: signedOperation2,
      },
    ]
    const accessChangeLog2: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: signedOperation1,
      },
      {
        changedBy: 'otherId',
        operation: signedOperation3,
      },
    ]
    const oldRecord = {
      id: 'itemId',
      accessChangeLog: accessChangeLog1,
      userAccess,
    } as Item
    const newRecord = {
      id: 'itemId',
      accessChangeLog: accessChangeLog2,
      userAccess,
    } as Item
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`accessChangeLog: existing entry 1 cannot be modified`)
  })
})
