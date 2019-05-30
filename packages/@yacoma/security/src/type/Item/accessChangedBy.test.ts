import * as crypt from '@yacoma/crypt'
import * as helpers from '../../helpers'
import {
  CollectionAccess,
  Item,
  itemAccessValue,
  RawUserWithKeys,
  UserAccess,
} from '../../types'
import * as validate from './'

/*
This field must contain the id of the user who last edited users, collections or \deleted.
*/
const now: number = Date.now()
let user1: RawUserWithKeys
let user2: RawUserWithKeys
const userAccess: UserAccess = {}
const userAccess2: UserAccess = {
  foo: {
    access: itemAccessValue.admin,
  },
}
const collectionAccess: CollectionAccess = {
  fooId: { signedBy: '', key: 'xxx' },
}
const collectionAccess2: CollectionAccess = {
  fooId: { signedBy: '', key: 'xxx' },
  barId: { signedBy: '', key: 'yyy' },
}
let newRecord: Item

describe('Item.accessChangedBy', () => {
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
    const now = Date.now()
    const date1 = await crypt.sign(user1.signKey, now)
    newRecord = {
      userAccess,
      collectionAccess,
      accessChangedBy: user1.id,
      accessChangedAt: date1,
    } as Item
  })

  it('should be current user on new item', async () => {
    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: {
          accessChangedBy: user1.id,
        } as Item,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: {
          accessChangedBy: user2.id,
        } as Item,
      })
    ).toBe(`accessChangedBy: should be current user (new item)`)
  })

  it('should not change if access does not change', async () => {
    const args1 = Object.assign({}, newRecord, {
      accessChangedBy: user2.id,
    }) as Item

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args1,
      })
    ).toBe(`accessChangedBy: should not change (same access)`)
  })

  it('should be current user if access changed', async () => {
    const args0 = Object.assign({}, newRecord, {
      userAccess: userAccess2,
    }) as Item
    const args1 = Object.assign({}, newRecord, {
      userAccess: userAccess2,
      accessChangedBy: user2.id,
    }) as Item
    const args2 = Object.assign({}, newRecord, {
      collectionAccess: collectionAccess2,
      accessChangedBy: user2.id,
    }) as Item
    const args3 = Object.assign({}, newRecord, {
      deleted: true,
      accessChangedBy: user2.id,
    }) as Item

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args0,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args1,
      })
    ).toBe(`accessChangedBy: should be current user (userAccess changed)`)

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args2,
      })
    ).toBe(`accessChangedBy: should be current user (collectionAccess changed)`)

    expect(
      await validate.accessChangedBy({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args3,
      })
    ).toBe(`accessChangedBy: should be current user (deleted changed)`)
  })
})
