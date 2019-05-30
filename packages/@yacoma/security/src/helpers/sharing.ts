import { encrypt } from '@yacoma/crypt'
import { ACCESS_KEYS } from '../type/Item/userAccess'
import { Collection, Item, RawUser, UserWithKeys } from '../types'
import { setCollectionAccess, setUserAccess } from './Item'
import { privateCollectionId } from './Item/makeId'
import { getItemKey, shareKeyWithUser } from './keys'

// TODO: add missing tests
export async function shareCollectionToUser(
  // Current user with access to the collection.
  currentUser: UserWithKeys,
  // Collection to be shared.
  collection: Collection,
  // User to send the invite to.
  user: RawUser,
  // These access are ADDED to what the user currently has. To
  // remove access, directly edit `userAccess`.
  addAccess: string = 'r'
) {
  const { userAccess } = collection
  let access: string = addAccess
  let newAccess = userAccess
  if (userAccess[user.id]) {
    const oldAccess = userAccess[user.id].access || ''
    access = ACCESS_KEYS.filter(
      k => oldAccess.includes(k) || addAccess.includes(k)
    ).join('')

    if (oldAccess === access) {
      return
    }
    newAccess = Object.assign({}, userAccess, {
      [user.id]: Object.assign({}, userAccess[user.id], {
        access,
      }),
    })
  } else {
    const key = currentUser.collections[collection.id]
    if (!key) {
      // This should never happen: if the collection is visible to share, current user has the key.
      throw new Error(
        `Cannot share collection to user (missing collection key).`
      )
    }
    const invite = await shareKeyWithUser(currentUser, user, key)
    newAccess = Object.assign({}, userAccess, {
      [user.id]: {
        invite,
        invitedBy: currentUser.id,
        pubKey: currentUser.ecdhPub,
        access,
      },
    })
  }
  return setUserAccess(currentUser, collection, newAccess)
}

// TODO: test
export async function shareItemToCollection(
  currentUser: UserWithKeys,
  item: Item,
  collectionId: string
) {
  if (item.collectionAccess[collectionId]) {
    return
  }
  const itemKey = await getItemKey(currentUser, item)
  const collKey = currentUser.collectionKeys[collectionId]
  if (!collKey) {
    throw new Error(
      `Cannot share item: cannot find collection key for collection id '${collectionId}'.`
    )
  }
  const privateId = privateCollectionId(currentUser.id)
  const key = await encrypt(currentUser.signKey, collKey, itemKey.encrypt)
  const newAccess = Object.assign(
    {},
    collectionId === privateId ? {} : item.collectionAccess,
    {
      [collectionId]: {
        signedBy: currentUser.id,
        key,
      },
    }
  )
  if (collectionId !== privateId) {
    delete newAccess[privateId]
  }
  setCollectionAccess(currentUser, item, newAccess)
}

// TODO: test
export async function unshareItemToCollection(
  currentUser: UserWithKeys,
  item: Item,
  collectionId: string
) {
  if (!item.collectionAccess[collectionId]) {
    return
  }
  const privateId = privateCollectionId(currentUser.id)
  const newAccess = Object.assign({}, item.collectionAccess)
  delete newAccess[collectionId]
  setCollectionAccess(currentUser, item, newAccess)
  if (Object.keys(newAccess).length === 0) {
    shareItemToCollection(currentUser, item, privateId)
  }
}
