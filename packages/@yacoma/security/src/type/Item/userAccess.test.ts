import { sign } from '@lucidogen/crypt'
import { beforeAll, describe, expect, it } from 'test'
import * as helpers from '../../helpers'
import {
  AccessChangeLogEntry,
  AccessChangeOperation,
  Item,
  itemAccessValue,
  UserAccess,
  UserWithKeys,
} from '../../types'
import * as validate from './'

let user1: UserWithKeys
const now: number = Date.now()

function testEntry(user: UserWithKeys, access: string) {
  const newRecord = {
    userAccess: {
      userId: { access },
      [user.id]: {
        access: itemAccessValue.admin,
      },
    },
  } as any
  return validate.userAccess({
    now,
    currentUser: user.user,
    oldRecord: undefined,
    newRecord,
  })
}

/*
A user can **edit** an Item if and only if he or she is in the item's
`userAccess` field with `e` (edit) access granted. On creation, the Item
author is always added to the `userAccess` field with `ae` (admin + edit)
access.

A user can **add users** to an Item if and only if he or she has an `a`
access to the item. The access is checked against the Item currently in the
database (previous version). If the Item is new, the author starts with
`ae` access and can therefore edit `userAccess` field. There is a special case for
`users.$id.invite` field (see in Collection chapter below).

Any change to this field is recorded as a new entry in **accessChangeLog** with type
'user'.
*/
describe('Item.userAccess', () => {
  beforeAll(async () => {
    const wordList = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    user1 = await helpers.userFromWordList(wordList)
  })

  it('should allow admin access to current user on new item', async () => {
    const operation: AccessChangeOperation = {
      changedAt: Date.now(),
      previous: 'itemId',
      id: user1.id,
      operation: 'add',
      type: 'user',
      access: itemAccessValue.admin,
    }
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: await sign(user1.signKey, operation),
      },
    ]
    const args1 = {
      id: 'itemId',
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.admin,
        },
      },
      accessChangeLog,
    } as Item
    const args2 = {
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.editor,
        },
      },
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: args1,
      })
    ).toBe(undefined)

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: args2,
      })
    ).toBe('userAccess: does not allow admin access to current user (new item)')
  })

  it('should contain valid entries', () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
      userId: {
        access: 'x',
      },
    }
    const newRecord = {
      id: 'itemId',
      type: 'Item',
      userAccess,
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(
      `userAccess: invalid access "x" for user "userId" in item type "Item"`
    )
  })

  it('should not validate unchanged userAccess', () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: 'xyz',
      },
    }
    const oldRecord = {
      id: 'itemId',
      userAccess,
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord: oldRecord,
      })
    ).toBe(undefined)
  })

  it('should only be changed by an admin', () => {
    const userAccess: UserAccess = {
      adminId: {
        access: itemAccessValue.admin,
      },
    }
    const userAccess2: UserAccess = {
      adminId: {
        access: itemAccessValue.admin,
      },
      [user1.id]: {
        access: itemAccessValue.admin,
      },
    }
    const oldRecord = {
      id: 'itemId',
      userAccess,
    } as Item
    const newRecord = {
      id: 'itemId',
      userAccess: userAccess2,
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe('userAccess: should only be changed by an admin')
  })

  it('should not remove own admin access', () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
    }
    const userAccess2: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.editor,
      },
    }
    const oldRecord = {
      id: 'itemId',
      userAccess,
    } as Item
    const newRecord = {
      id: 'itemId',
      userAccess: userAccess2,
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe('userAccess: should not remove your admin access')
  })

  it('should only contain valid fields', () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
    }
    const userAccess2: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
      userId: {
        access: 'aex',
      },
    }
    const oldRecord = {
      id: 'itemId',
      type: 'Item',
      userAccess,
    } as Item
    const newRecord = {
      id: 'itemId',
      type: 'Item',
      userAccess: userAccess2,
    } as Item

    expect(
      validate.userAccess({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(
      `userAccess: invalid access "aex" for user "userId" in item type "Item"`
    )
  })

  it('should throw on empty access', () => {
    expect(testEntry(user1, '')).toEqual(
      `userAccess: invalid access "" for user "userId" in item type "undefined"`
    )
  })

  it('should throw on invalid access value', () => {
    expect(testEntry(user1, 'x')).toEqual(
      `userAccess: invalid access "x" for user "userId" in item type "undefined"`
    )
  })

  it('should pass on valid access values', () => {
    expect(testEntry(user1, 'a')).toEqual(undefined)
    expect(testEntry(user1, itemAccessValue.admin)).toEqual(undefined)
    expect(testEntry(user1, itemAccessValue.editor)).toEqual(undefined)
  })
})
