import { collectionAccessValue, User, UserWithKeys } from '../types'
import * as security from './'
import { contactId, privateCollectionId, workCollectionId } from './Item/makeId'

let currentUser: UserWithKeys

describe('createContact', () => {
  beforeAll(async () => {
    const { user } = await security.createUser(['lazy', 'cow'], {
      domain: 'bugslife',
      username: 'Flik',
    })
    currentUser = user
  })

  it('should return user, contact and collections', async () => {
    const {
      contact,
      privateCollection,
      user,
      workCollection,
    } = await security.createContact(currentUser, ['foo', 'bar'], {
      username: 'John Lily',
    })
    expect(privateCollection.id).toBe(privateCollectionId(user.id))
    expect(workCollection).toBe(undefined)

    expect(contact!.id).toBe(contactId(user.id))
    expect(contact!.editor).toBe(currentUser.id)

    expect((user.user as User).domain).toBe('bugslife')

    expect(Object.keys(user.collectionKeys)).toEqual(['p.' + user.id])
    expect(Object.keys(user.collections)).toEqual(['p.' + user.id])
  })

  it('should return user and collections for protected user', async () => {
    const {
      contact,
      privateCollection,
      user,
      workCollection,
    } = await security.createContact(currentUser, ['foo', 'bar'], {
      username: 'John Lily',
      protected: true,
    })
    expect(privateCollection.id).toBe(privateCollectionId(user.id))
    expect(workCollection!.id).toBe(workCollectionId(user.id))

    expect(contact).toBe(undefined)
    if (!workCollection) {
      throw new Error(`Should create work collection.`)
    }

    const invite = workCollection.userAccess[currentUser.id].invite
    expect(typeof invite).toBe('string')
    const key = workCollection.userAccess[user.id].key
    expect(workCollection.userAccess).toEqual({
      [currentUser.id]: {
        access: collectionAccessValue.admin,
        invite,
        invitedBy: user.id,
        pubKey: user.ecdhPub,
      },
      [user.id]: {
        access: collectionAccessValue.admin,
        key,
      },
    })
    expect(Object.keys(user.collectionKeys)).toEqual([
      'p.' + user.id,
      'w.' + user.id,
    ])
    expect(Object.keys(user.collections)).toEqual([
      'p.' + user.id,
      'w.' + user.id,
    ])
  })

  it('should create first admin', async () => {
    const { contact, user } = await security.createContact(
      undefined,
      ['foo', 'bar'],
      {
        username: 'Pierre Boulez',
      }
    )
    expect(contact!.editor).toBe(user.id)
  })
})
