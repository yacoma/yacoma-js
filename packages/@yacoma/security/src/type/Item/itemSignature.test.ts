import { beforeAll, describe, expect, it } from 'test'
import * as helpers from '../../helpers'
import { Item, UserWithKeys } from '../../types'
import * as validate from './'

let user1: UserWithKeys
let user2: UserWithKeys

/*
This field must contain the signature of the item).
*/
describe('Item.signature', () => {
  beforeAll(async () => {
    user1 = await helpers.userFromWordList(['black', 'fruit'])
    user2 = await helpers.userFromWordList(['dangerous', 'gorilla'])
  })

  it('should be signed by editor', async () => {
    const oldRecord = {
      content: 'foo',
    } as Item

    const newRecord = {
      content: 'bar',
    } as Item

    expect(
      await validate.itemSignature({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord,
        newRecord: Object.assign({}, newRecord, {
          signature: await helpers.getSignature(user1.signKey, newRecord),
        }),
      })
    ).toBe(undefined)

    expect(
      await validate.itemSignature({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord,
        newRecord: Object.assign({}, newRecord, {
          signature: await helpers.getSignature(user2.signKey, newRecord),
        }),
      })
    ).toBe(`signature: invalid signature`)
  })
})
