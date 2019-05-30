import { userFromWordList } from '../'
import { throwMessage } from '../../test'
import { Item, itemAccessValue, RawUserWithKeys } from '../../types'
import { setDeleted } from './'

let user1: RawUserWithKeys
let baseItem: Item

describe('setDeleted', () => {
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
    baseItem = {
      id: 'itemId',
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.admin,
        },
      },
    } as Item
  })

  it('should set deleted to true or false', async () => {
    const item = Object.assign({}, baseItem)
    await setDeleted(user1, item, true)
    expect(item.deleted).toBe(true)
    await setDeleted(user1, item, false)
    expect(item.deleted).toBe(false)
  })

  it('should set original', async () => {
    const item = Object.assign({}, baseItem)
    const original = Object.assign({}, item)
    await setDeleted(user1, item as Item, true)
    expect(item.original).toEqual(original)
  })

  it('should reset accessChangedAt', async () => {
    const item = Object.assign({}, baseItem, { accessChangedAt: 'fofofofo' })
    await setDeleted(user1, item as Item, true)
    expect(item.accessChangedAt).toEqual('')
  })

  it('should set accessChangedBy', async () => {
    const item = Object.assign({}, baseItem, { editor: 'someOtherId' })
    await setDeleted(user1, item as Item, true)
    expect(item.accessChangedBy).toEqual(user1.id)
  })

  it('should not update accessChangeLog', async () => {
    const item = Object.assign({}, baseItem, { accessChangeLog: [] })
    await setDeleted(user1, item as Item, true)
    expect(item.accessChangeLog).toEqual([])
  })

  it('should throw if user is not an admin', async () => {
    const item = Object.assign({}, baseItem, {
      userAccess: {
        [user1.id]: {
          access: itemAccessValue.editor,
        },
      },
    })
    expect(await throwMessage(() => setDeleted(user1, item, true))).toMatch(
      `You do not have enough rights to delete.`
    )
  })

  it('should throw if value is not true or false', async () => {
    const item = Object.assign({}, baseItem)
    expect(await throwMessage(() => setDeleted(user1, item, 'hello'))).toMatch(
      `Invalid value for 'deleted' (should be true or false).`
    )
  })
})
