import * as crypt from '@yacoma/crypt'
import * as helpers from '../../helpers'
import {
  FUTURE_LEEWAY,
  FUTURE_MESSAGE,
  PAST_LEEWAY,
  PAST_MESSAGE,
} from '../../helpers/time'
import {
  CollectionAccess,
  Item,
  itemAccessValue,
  RawUserWithKeys,
  UserAccess,
} from '../../types'
import * as validate from './'

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

/*
This field must contain the current time when access is edited (with max 1
minutes difference with server time). Signed by `admin`.
*/
describe('Item.accessChangedAt', () => {
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

  it('should be createdAt on new item', async () => {
    const now = Date.now()
    const date1 = new Date(now).toISOString()
    const date2 = new Date(now + 1).toISOString()
    const args1 = {
      createdAt: date1,
      accessChangedAt: date1,
    } as Item
    const args2 = {
      createdAt: date1,
      accessChangedAt: date2,
    } as Item

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: args1,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user2.user,
        oldRecord: undefined,
        newRecord: args2,
      })
    ).toBe(`accessChangedAt: should equal createdAt (new item)`)
  })

  it('should change if access changed', async () => {
    const now = Date.now()
    const args1 = Object.assign({}, newRecord, {
      userAccess: userAccess2,
    }) as Item
    const args2 = Object.assign({}, newRecord, {
      collectionAccess: collectionAccess2,
    }) as Item
    const args3 = Object.assign({}, newRecord, { deleted: true }) as Item

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args1,
      })
    ).toBe(`accessChangedAt: should update (userAccess changed)`)

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args2,
      })
    ).toBe(`accessChangedAt: should update (collectionAccess changed)`)

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args3,
      })
    ).toBe(`accessChangedAt: should update (deleted changed)`)
  })

  it('should not change if access does not change', async () => {
    const now = Date.now()
    const date2 = new Date(now + 1).toISOString()
    const args1 = Object.assign({}, newRecord, {
      accessChangedAt: date2,
    }) as Item

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedAt({
        now,
        currentUser: user1.user,
        oldRecord: newRecord,
        newRecord: args1,
      })
    ).toBe(`accessChangedAt: should not change (same access)`)
  })

  it('should not be too old', async () => {
    const now = Date.now()
    const oldDate = new Date(now - 13000).toISOString()
    const newDate = new Date(now).toISOString()
    const oldRecord = {
      userAccess,
      accessChangedBy: user1.id,
      accessChangedAt: oldDate,
    } as Item
    const newRecord = {
      userAccess: userAccess2,
      accessChangedBy: user1.id,
      accessChangedAt: newDate,
    } as Item
    expect(
      await validate.accessChangedAt({
        now: now + PAST_LEEWAY,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedAt({
        now: now + PAST_LEEWAY + 1,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`accessChangedAt: ${PAST_MESSAGE}`)
  })

  it('should not be too far in the future', async () => {
    const now = Date.now()
    const oldDate = new Date(now - 13000).toISOString()
    const newDate = new Date(now).toISOString()
    const oldRecord = {
      userAccess,
      accessChangedBy: user1.id,
      accessChangedAt: oldDate,
    } as Item
    const newRecord = {
      userAccess: userAccess2,
      accessChangedBy: user1.id,
      accessChangedAt: newDate,
    } as Item
    expect(
      await validate.accessChangedAt({
        now: now - FUTURE_LEEWAY,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.accessChangedAt({
        now: now - FUTURE_LEEWAY - 1,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`accessChangedAt: ${FUTURE_MESSAGE}`)
  })
})
