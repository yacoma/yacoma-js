import { createEncryptionKey, encrypt, EncryptionKeys } from '@yacoma/crypt'
import {
  FileItem,
  isCollection,
  isFile,
  Item,
  itemAccessValue,
  UserWithKeys,
} from '../../types'
import { idForType, privateCollectionId } from './makeId'
import { setCollectionAccess } from './setCollectionAccess'
import { setContent } from './setContent'
import { setUserAccess } from './setUserAccess'

export async function createItem<T extends Item = Item>(
  currentUser: UserWithKeys,
  args: Partial<T> = {},
  content?: any,
  // Used to create an Item directly in a Collection (not used to create Collections themselves)
  collectionId?: string,
  theItemKeys?: EncryptionKeys
): Promise<T> {
  const userId = currentUser.id
  const collId = collectionId || privateCollectionId(userId)

  const type = args.type || 'Item'
  const id = args.id || idForType(type)

  const item = {
    id,
    type,
    revision: 1,
    createdAt: '',
    creator: userId,
    editedAt: '',
    editor: userId,
    accessChangedAt: '',
    accessChangedBy: userId,
  } as Item

  if (isFile(item)) {
    const fargs = (args as any) as FileItem
    item.fileId = fargs.fileId
    item.fileBy = fargs.fileBy
    item.fileSize = fargs.fileSize
  }

  if (isCollection(item)) {
    // For collections, the itemKey === collectionKey so that sharing a collection inside
    // a WorkCollection also shares the collectionKey.

    // Collection: itemKey === collectionKey
    const itemKey = currentUser.collections[item.id]
    const collKey = currentUser.collectionKeys[item.id]

    if (!collKey) {
      // Create collection key
      throw new Error(
        `Cannot create Collection: collection key should be in current user.`
      )
    }

    if (!args.userAccess) {
      // We ask for the user of this API to setup `userAccess` because it may require
      // creating invites and complex setup. We cannot just create the collection key
      // now because this encryption needs to be done before hand.
      throw new Error(`Cannot create Collection: missing 'userAccess' value.`)
    }
    await setUserAccess(currentUser, item, args.userAccess)

    // Dummy operation (itemKey encrypted with collKey === itemKey). This is to make
    // collections behave exactly like items.
    const encryptedItemKey = await encrypt(
      currentUser.signKey,
      collKey,
      itemKey
    )
    const collectionAccess = {
      [item.id]: {
        signedBy: currentUser.id,
        key: encryptedItemKey, // collKey(itemKey)
      },
    }
    await setCollectionAccess(currentUser, item, collectionAccess)
  } else {
    // Item: create the item encryption key.
    const itemKey = theItemKeys || (await createEncryptionKey())
    const userAccess = {
      [currentUser.id]: {
        access: itemAccessValue.admin,
      },
    }
    await setUserAccess(currentUser, item, userAccess)

    // Items start in private collection unless `collectionAccess` is provided (with dummy key).
    const collKey = currentUser.collectionKeys[collId]
    if (!collKey) {
      throw new Error(
        `Cannot create collection: missing key for collection '${collId}' in current user.`
      )
    }

    const key = await encrypt(currentUser.signKey, collKey, itemKey.encrypt)
    const collectionAccess = {
      [collId]: {
        signedBy: currentUser.id,
        key,
      },
    }
    await setCollectionAccess(currentUser, item, collectionAccess)
  }

  await setContent(currentUser, item, content || { title: '' })

  return item as T
}
