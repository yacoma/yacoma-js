import { createItem, createUser, dateAndSign } from '../'
import { UserWithKeys } from '../../types'
import { parseFields, stringifyFields } from './stringify'

describe('stringify', () => {
  let currentUser: UserWithKeys
  beforeAll(async () => {
    currentUser = (await createUser(['foo', 'bar'])).user
  })

  it('should stringify fields', async () => {
    const item = await dateAndSign(currentUser, await createItem(currentUser))
    const sitem = stringifyFields(item)
    expect(typeof sitem.userAccess).toBe('string')
    expect(typeof sitem.collectionAccess).toBe('string')
    expect(typeof sitem.accessChangeLog).toBe('string')
  })
})

describe('parseFields', () => {
  let currentUser: UserWithKeys
  beforeAll(async () => {
    currentUser = (await createUser(['foo', 'bar'])).user
  })

  it('should parse fields', async () => {
    const item = await dateAndSign(currentUser, await createItem(currentUser))
    const sitem = stringifyFields(item)
    const pitem = parseFields(sitem)
    expect(pitem).toEqual(item)
    expect(typeof pitem.userAccess).toBe('object')
    expect(typeof pitem.collectionAccess).toBe('object')
    expect(typeof pitem.accessChangeLog).toBe('object')
  })
})
