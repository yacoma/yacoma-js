import * as helpers from '../../helpers'
import {
  FUTURE_LEEWAY,
  FUTURE_MESSAGE,
  PAST_LEEWAY,
  PAST_MESSAGE,
} from '../../helpers/time'
import { Item, UserWithKeys } from '../../types'
import * as validate from './'

let user1: UserWithKeys
let baseItem: Item

/*
This field must be signed by creator.
It must be close to `savedAt` for new items.
It cannot be changed after item creation.
*/
describe('Item.createdAt', () => {
  beforeAll(async () => {
    const wordList = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    const { user } = await helpers.createUser(wordList)
    user1 = user
    baseItem = await helpers.createItem(user)
  })

  it('should not change', async () => {
    const now = Date.now()
    const oldRecord = Object.assign({}, baseItem, {
      createdAt: new Date(now).toISOString(),
    })
    const newRecord = Object.assign({}, baseItem, {
      createdAt: new Date(now + 1).toISOString(),
    })
    expect(
      await validate.createdAt({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe('createdAt: should not change')
  })

  it('should not be too old', async () => {
    const now = Date.now()
    const newRecord = Object.assign({}, baseItem, {
      createdAt: new Date(now).toISOString(),
    })

    expect(
      await validate.createdAt({
        now: now + PAST_LEEWAY,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.createdAt({
        now: now + PAST_LEEWAY + 1,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`createdAt: ${PAST_MESSAGE}`)
  })

  it('should not be more too far in the future', async () => {
    const now = Date.now()
    const newRecord = Object.assign({}, baseItem, {
      createdAt: new Date(now).toISOString(),
    })
    expect(
      await validate.createdAt({
        now: now - FUTURE_LEEWAY,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(undefined)
    expect(
      await validate.createdAt({
        now: now - FUTURE_LEEWAY - 1,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(`createdAt: ${FUTURE_MESSAGE}`)
  })
})
