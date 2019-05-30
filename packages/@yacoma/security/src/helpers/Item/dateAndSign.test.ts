import { userFromWordList } from '../'
import { throwMessage } from '../../test'
import * as validate from '../../type/Item'
import { Item, itemAccessValue, RawUserWithKeys, UserAccess } from '../../types'
import { dateAndSign } from './'

let user1: RawUserWithKeys
const original = {
  id: 'itemId',
  createdAt: 'someCreationDate',
  editedAt: 'someEditDate',
  accessChangedAt: 'someAccessDate',
  userAccess: {},
} as Item

describe('dateAndSign', () => {
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
  })

  it('should set date and sign empty dates', async () => {
    const item = {
      id: 'itemId',
      createdAt: '',
      editedAt: '',
      accessChangedAt: '',
      userAccess: {},
      original,
    } as Item
    const newItem = await dateAndSign(user1, item)
    const now = Date.parse(newItem.createdAt)
    const xnow = Date.now()
    expect(xnow - now).toBeLessThanOrEqual(2000)
    expect(newItem.editedAt).toEqual(newItem.createdAt)
    expect(newItem.accessChangedAt).toEqual(newItem.createdAt)
  })

  it('should not set non-empty dates', async () => {
    const item = {
      id: 'itemId',
      createdAt: 'someCreationDate',
      editedAt: 'someEditDate',
      accessChangedAt: 'someAccessDate',
      userAccess: {},
      original,
    } as Item

    const newItem = await dateAndSign(user1, item)
    expect(newItem.createdAt).toEqual('someCreationDate')
    expect(newItem.editedAt).toEqual('someEditDate')
    expect(newItem.accessChangedAt).toEqual('someAccessDate')
  })

  it('should create valid accessLog', async () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
      fooId: {
        access: itemAccessValue.editor,
      },
    }
    const item = {
      id: 'itemId',
      creator: user1.id,
      createdAt: 'someCreationDate',
      editedAt: 'someEditDate',
      accessChangedAt: 'someAccessDate',
      userAccess,
      original,
    } as Item

    const newItem = await dateAndSign(user1, item)
    const now = Date.now()
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: undefined,
        newRecord: newItem,
      })
    ).toBe(undefined)
  })

  it('should update accessLog', async () => {
    const userAccess: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
    }
    const userAccess2: UserAccess = {
      [user1.id]: {
        access: itemAccessValue.admin,
      },
      fooId: {
        access: itemAccessValue.editor,
      },
    }
    const item = {
      id: 'itemId',
      createdAt: 'someCreationDate',
      editedAt: 'someEditDate',
      accessChangedAt: 'someAccessDate',
      userAccess,
      original,
    } as Item
    const newItem = await dateAndSign(user1, item)
    const item2 = Object.assign({}, newItem)
    item2.original = newItem
    item2.userAccess = userAccess2
    const newItem2 = await dateAndSign(user1, item2)
    const now = Date.now()
    expect(
      await validate.accessChangeLog({
        now,
        currentUser: user1.user,
        oldRecord: newItem,
        newRecord: newItem2,
      })
    ).toBe(undefined)
  })

  it('should throw on unchanged item', async () => {
    expect(await throwMessage(() => dateAndSign(user1, original))).toEqual(
      `Cannot save unchanged item (missing 'original' field).`
    )
  })
})
