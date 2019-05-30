import { sign } from '@lucidogen/crypt'
import { beforeAll, describe, expect, it } from 'test'
import * as helpers from '../../helpers'
import {
  AccessChangeLogEntry,
  AccessChangeOperation,
  CollectionAccess,
  Item,
  itemAccessValue,
  RawUserWithKeys,
  UserAccess,
} from '../../types'
import * as validate from './'

let user1: RawUserWithKeys

const collectionAccess: CollectionAccess = {
  collId: {
    key: 'xxx',
    signedBy: 'xxx',
  },
}

/*
Only users with **admin** access can change fields in collections.

Any change to this field is recorded as a new entry in **accessChangeLog** with type
'collection'.
*/
describe('Item.collectionAccess', () => {
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

  it('should pass on valid entry with valid access log', async () => {
    const operation: AccessChangeOperation = {
      changedAt: Date.now(),
      previous: 'itemId',
      id: user1.id,
      operation: 'invite',
      type: 'collection',
    }
    const accessChangeLog: AccessChangeLogEntry[] = [
      {
        changedBy: user1.id,
        operation: await sign(user1.signKey, operation),
      },
    ]
    const newRecord = {
      id: 'itemId',
      collectionAccess,
      accessChangeLog,
    } as Item

    expect(
      await validate.collectionAccess({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(undefined)
  })

  it('should only be changed by an admin', async () => {
    const userAccess: UserAccess = {
      adminId: { access: itemAccessValue.admin },
    }
    const collectionAccess2: CollectionAccess = {
      barId: { key: 'zzz', signedBy: 'barId' },
    }
    const oldRecord = {
      id: 'itemId',
      userAccess,
      collectionAccess,
    } as Item
    const newRecord = {
      id: 'itemId',
      userAccess,
      collectionAccess: collectionAccess2,
    } as Item
    expect(
      await validate.collectionAccess({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe('collectionAccess: should only be changed by an admin')
  })
})
