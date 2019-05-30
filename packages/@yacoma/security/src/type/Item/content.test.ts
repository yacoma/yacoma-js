import {
  createEncryptionKey,
  encrypt,
  EncryptionKeys,
  sign,
} from '@lucidogen/crypt'
import { beforeAll, describe, expect, it } from 'test'
import * as helpers from '../../helpers'
import { Item, itemAccessValue, RawUserWithKeys } from '../../types'
import * as validate from './'

let user1: RawUserWithKeys
let user2: RawUserWithKeys
let itemKey: EncryptionKeys
let baseItem: Item

/*
This field contains encrypted JSON content for the item content. It must be
signed by editor.
*/
describe('Item.content', () => {
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
    itemKey = await createEncryptionKey()
    const content = await encrypt(user1.signKey, itemKey.encryptionKey, {
      some: 'content',
    })
    const editedAt = await sign(user1.signKey, Date.now())
    baseItem = ({
      id: 'itemId',
      editor: user1.id,
      editedAt,
      content,
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.admin,
        },
      },
    } as Partial<Item>) as Item
  })

  it('should accept a valid content', async () => {
    expect(
      await validate.content({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: baseItem,
      })
    ).toBe(undefined)
  })

  it('should be signed by currentUser (new item)', async () => {
    const content2 = await encrypt(user2.signKey, itemKey.encryptionKey, {
      a: 'content',
    })
    expect(
      await validate.content({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: Object.assign({}, baseItem, { content: content2 }),
      })
    ).toBe(`content: should be signed by current user (content changed)`)
  })

  it('should be signed by currentUser if changed (updated item)', async () => {
    const content2 = await encrypt(user2.signKey, itemKey.encryptionKey, {
      a: 'content',
    })
    expect(
      await validate.content({
        now: Date.now(),
        currentUser: user1.user,
        oldRecord: baseItem,
        newRecord: Object.assign({}, baseItem, { content: content2 }),
      })
    ).toBe(`content: should be signed by current user (new content)`)
  })
})
