import {
  createEncryptionKey,
  decrypt,
  encrypt,
  EncryptionKeys,
} from '@yacoma/crypt'
import { userFromWordList } from '../'
import { throwMessage } from '../../test'
import { Item, itemAccessValue, UserWithKeys } from '../../types'
import { setContent } from './'

let user1: UserWithKeys
let itemKey: EncryptionKeys
let collKey: EncryptionKeys
let encryptedItemKey: string
let baseItem: Item
const collId = 'someCollId'

describe('setContent', () => {
  beforeAll(async () => {
    const wordList = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    user1 = await userFromWordList(wordList)
    itemKey = await createEncryptionKey()
    collKey = await createEncryptionKey()
    user1.collectionKeys[collId] = collKey.encryptionKey
    encryptedItemKey = await encrypt(
      user1.signKey,
      collKey.encryptionKey,
      itemKey.encrypt
    )
    baseItem = ({
      id: 'itemId',
      content: '',
      collectionAccess: {
        [collId]: {
          signedBy: user1.id,
          // Item key encrypted with collection key.
          key: encryptedItemKey,
        },
      },
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.admin,
        },
      },
    } as Partial<Item>) as Item
  })

  it('should encrypt content with itemKey', async () => {
    const content = { some: 'random', content: 'here' }
    const item = Object.assign({}, baseItem)
    await setContent(user1, item, content)
    const decryptedContent = await decrypt<typeof content>(
      user1.id,
      itemKey.encryptionKey,
      item.content!
    )
    expect(decryptedContent.payload).toEqual(content)
  })

  it('should set original', async () => {
    const item = Object.assign({}, baseItem)
    const original = Object.assign({}, item)
    await setContent(user1, item as Item, {})
    expect(item.original).toEqual(original)
  })

  it('should not set original if already set', async () => {
    const original = Object.assign({}, baseItem, { foo: 'bar' })
    const item = Object.assign({}, baseItem, { original })
    await setContent(user1, item as Item, {})
    expect(item.original).toBe(original)
  })

  it('should reset editedAt', async () => {
    const item = Object.assign({}, baseItem, { editedAt: 'fofofofo' })
    await setContent(user1, item as Item, {})
    expect(item.editedAt).toEqual('')
  })

  it('should set editor', async () => {
    const item = Object.assign({}, baseItem, { editor: 'someOtherId' })
    await setContent(user1, item as Item, {})
    expect(item.editor).toEqual(user1.id)
  })

  it('should not update accessChangeLog', async () => {
    const item = Object.assign({}, baseItem, { accessChangeLog: [] })
    await setContent(user1, item as Item, {})
    expect(item.accessChangeLog).toEqual([])
  })

  it('should throw if user is not an editor', async () => {
    const item = Object.assign({}, baseItem, {
      userAccess: {
        [user1.id]: 'a',
      },
    })
    expect(await throwMessage(() => setContent(user1, item, {}))).toMatch(
      `You do not have enough rights to edit content.`
    )
  })

  it('should throw if user cannot decrypt item key', async () => {
    const user = Object.assign({}, user1, {
      collectionKeys: {},
    })
    expect(await throwMessage(() => setContent(user, baseItem, {}))).toMatch(
      `Invalid item or user: you do not have any collection key to decrypt item key`
    )
  })
})
