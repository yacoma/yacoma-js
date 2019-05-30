import * as helpers from '../../helpers'
import {
  FUTURE_LEEWAY,
  FUTURE_MESSAGE,
  PAST_LEEWAY,
  PAST_MESSAGE,
} from '../../helpers/time'
import { Item, RawUserWithKeys } from '../../types'
import * as validate from './'

let user1: RawUserWithKeys
let user2: RawUserWithKeys

/*
This field must contain the current time when content is edited (with max 5
minutes difference with server time).
*/
describe('Item.editedAt', () => {
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
  })

  it('should be createdAt on new item', async () => {
    const now = Date.now()
    const date1 = new Date(now).toISOString()
    const date2 = new Date(now + 1).toISOString()
    const args1 = {
      createdAt: date1,
      editedAt: date1,
    } as Item
    const args2 = {
      createdAt: date1,
      editedAt: date2,
    } as Item
    expect(
      await validate.editedAt({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: args1,
      })
    ).toBe(undefined)

    expect(
      await validate.editedAt({
        now,
        currentUser: user2.user,
        oldRecord: undefined,
        newRecord: args2,
      })
    ).toBe(`editedAt: should equal createdAt (new content)`)
  })

  it('should change if content changed', async () => {
    const now = Date.now()
    const date = new Date(now).toISOString()
    const oldRecord = {
      content: 'foo',
      editor: user1.id,
      editedAt: date,
    } as Item
    const newRecord = {
      content: 'bar',
      editor: user1.id,
      editedAt: date,
    } as Item

    expect(
      await validate.editedAt({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`editedAt: should update (changed content)`)
  })

  it('should not change if content does not change', async () => {
    const now = Date.now()
    const date0 = new Date(now).toISOString()
    const date1 = new Date(now + 1).toISOString()
    const oldRecord = {
      content: 'foo',
      editor: user1.id,
      editedAt: date0,
    } as Item
    const newRecord = {
      content: 'foo',
      editor: user1.id,
      editedAt: date1,
    } as Item

    expect(
      await validate.editedAt({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord: oldRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.editedAt({
        now,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`editedAt: should not change (same content)`)
  })

  it('should not be too old', async () => {
    const now = Date.now()
    const oldDate = new Date(now - 13000).toISOString()
    const newDate = new Date(now).toISOString()
    const oldRecord = {
      content: 'foo',
      editor: user1.id,
      editedAt: oldDate,
    } as Item
    const newRecord = {
      content: 'bar',
      editor: user1.id,
      editedAt: newDate,
    } as Item

    expect(
      await validate.editedAt({
        now: now + PAST_LEEWAY,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.editedAt({
        now: now + PAST_LEEWAY + 1,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`editedAt: ${PAST_MESSAGE}`)
  })

  it('should not be too far in the future', async () => {
    const now = Date.now()
    const oldDate = new Date(now - 13000).toISOString()
    const newDate = new Date(now).toISOString()
    const oldRecord = {
      content: 'foo',
      editor: user1.id,
      editedAt: oldDate,
    } as Item
    const newRecord = {
      content: 'bar',
      editor: user1.id,
      editedAt: newDate,
    } as Item

    expect(
      await validate.editedAt({
        now: now - FUTURE_LEEWAY,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.editedAt({
        now: now - FUTURE_LEEWAY - 1,
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe(`editedAt: ${FUTURE_MESSAGE}`)
  })
})
