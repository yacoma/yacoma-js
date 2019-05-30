import * as crypt from '@yacoma/crypt'
import {
  Collection,
  collectionAccessValue,
  CollectionUserAccess,
  User,
  UserWithKeys,
} from '../types'
import { createItem, setContent } from './Item'
import { collectionId, pairCollectionId } from './Item/makeId'
import { shareKeyWithUser } from './keys'

export async function createCollection(
  currentUser: UserWithKeys,
  args: Partial<Collection> = {},
  content?: any
) {
  const collKey = await crypt.createEncryptionKey()
  const key = await crypt.encrypt(
    currentUser.signKey,
    currentUser.encryptionKey,
    collKey.encrypt
  )
  const userAccess: CollectionUserAccess = {
    [currentUser.id]: {
      access: collectionAccessValue.admin,
      key, // currentUser.encrypt(collKey)
    },
  }
  const id = args.id || collectionId()
  currentUser.collections[id] = collKey.encrypt
  currentUser.collectionKeys[id] = collKey.encryptionKey
  const item = await createItem(currentUser, {
    id,
    type: args.type || 'Collection',
    userAccess,
  })

  await setContent(currentUser, item, content || { title: '' })

  return item as Collection
}

export async function createPairCollection(
  currentUser: UserWithKeys,
  user: User
): Promise<Collection> {
  const collKey = await crypt.createEncryptionKey()
  const key = await crypt.encrypt(
    currentUser.signKey,
    currentUser.encryptionKey,
    collKey.encrypt
  )
  const invite = await shareKeyWithUser(currentUser, user, collKey.encrypt)

  const userAccess: CollectionUserAccess = {
    [currentUser.id]: {
      access: 'er+-',
      key, // currentUser.encrypt(collKey)
    },
    [user.id]: {
      access: 'er+-',
      invite,
      invitedBy: currentUser.id,
      pubKey: currentUser.ecdhPub,
    },
  }
  const id = pairCollectionId(currentUser.id, user.id)
  // Collection key must exist in userAccess before we create the item.
  // Own key for Collection or private collection key for Item.
  currentUser.collections[id] = collKey.encrypt
  currentUser.collectionKeys[id] = collKey.encryptionKey
  const item = await createItem(currentUser, {
    id,
    type: 'PairCollection',
    userAccess,
  })

  const title = [currentUser.id.slice(0, 8), user.id.slice(0, 8)].join(' - ')
  await setContent(currentUser, item, { title })

  return item as Collection
}

// export function mutateCollection() {}
