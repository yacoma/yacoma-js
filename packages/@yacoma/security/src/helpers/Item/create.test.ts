import { createItem, createUser } from '../'
import { Item, itemAccessValue, UserAccess, UserWithKeys } from '../../types'

let user1: UserWithKeys
let userAccess: UserAccess

describe('create', () => {
  beforeAll(async () => {
    const wordList = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    const { user } = await createUser(wordList)
    user1 = user
    userAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
    }
  })

  it('should create an Item with empty dates', async () => {
    const userId = user1.id
    const item = await createItem(user1)
    const base: Partial<Item> = {
      creator: userId,
      createdAt: '',
      editor: userId,
      editedAt: '',
      type: 'Item',
      userAccess,
    }
    const result = Object.assign(
      {},
      ...Object.keys(base).map(k => ({ [k]: (item as any)[k] }))
    )
    expect(result).toEqual(base)
  })
})
