import * as helpers from '../../helpers'
import { UserWithKeys } from '../../types'
import * as validate from './'

let user1: UserWithKeys
let user2: UserWithKeys

/*
This field must be the same as current user for new items. It cannot be
changed after item creation.
*/
describe('Item.creator', () => {
  beforeAll(async () => {
    const wordList1 = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    let user = await helpers.createUser(wordList1)
    user1 = user.user
    const wordList2 = [
      'dangerous',
      'gorilla',
      'nowhere',
      'laptop',
      'iceberg',
      'tomorrow',
    ]
    user = await helpers.createUser(wordList2)
    user2 = user.user
  })

  it('should be equal to current user on new item', async () => {
    const newRecord = await helpers.createItem(user1)
    expect(
      validate.creator({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe(undefined)
  })

  it('should return an error if not equal to current user on new item', async () => {
    const newRecord = await helpers.createItem(user2)
    expect(
      validate.creator({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord,
      })
    ).toBe('creator: does not match current user')
  })

  it('should not change on edit', async () => {
    const oldRecord = await helpers.createItem(user2)
    const newRecord = Object.assign({}, oldRecord, { creator: user1.id })
    expect(
      validate.creator({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord,
        newRecord,
      })
    ).toBe('creator: cannot be changed')
  })
})
