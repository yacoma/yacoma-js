import * as crypt from '@lucidogen/crypt'
import { Collection, isCollection, Item, RawUser, UserWithKeys } from '../types'
import { PublicKeys } from './User'

async function keyFromCollectionAccess(
  currentUser: UserWithKeys,
  item: Item
): Promise<crypt.EncryptionKeys> {
  // Try to find a collection for which we have the key:
  for (let collId of Object.keys(item.collectionAccess)) {
    const collKey = currentUser.collectionKeys[collId]
    const itemKeyInfo = item.collectionAccess[collId]
    if (collKey && itemKeyInfo) {
      // We have a key

      const { payload: encrypt } = await crypt.decrypt<string>(
        itemKeyInfo.signedBy,
        collKey,
        itemKeyInfo.key
      )
      const encryptionKey = await crypt.importEncryptionKey(encrypt)

      // TODO: could cache this information in
      // currentUser.itemKeys...
      return { encrypt, encryptionKey }
    }
  }
  // How could we create or read if we do not have the key ? This should not happen.
  throw new Error(
    `Invalid item or user: you do not have any collection key to decrypt item key`
  )
}

/**
 *
 * ItemKey ==> encrypted with CollectionKey
 * CollectionKey === ItemKey for Collection
 * CollectionKey encrypted with user keys
 */
export async function getItemKey(
  currentUser: UserWithKeys,
  item: Item
): Promise<crypt.EncryptionKeys> {
  if (isCollection(item)) {
    // Get collection key through userAccess or collectionAccess for
    // collections shared in WorkCollection.
    return storeCollectionKey(currentUser, item)
  } else {
    return keyFromCollectionAccess(currentUser, item)
  }
}

export async function storeCollectionKey(
  currentUser: UserWithKeys,
  collection: Collection
): Promise<crypt.EncryptionKeys> {
  const { id } = collection
  let keys: crypt.EncryptionKeys = {
    encryptionKey: currentUser.collectionKeys[id],
    encrypt: currentUser.collections[id],
  }
  if (keys.encryptionKey) {
    // Key is already there
    return keys
  }

  // Key was not yet needed: get key from userAccess
  const access = collection.userAccess[currentUser.id]
  if (!access) {
    // Collection was not shared directly but through a WorkCollection, try to get
    // key through collectionAccess.
    keys = await keyFromCollectionAccess(currentUser, collection)
  } else {
    const { invite, key, invitedBy, pubKey } = access
    if (invite) {
      if (!invitedBy) {
        throw new Error(`Invalid collection: invite but missing invitedBy.`)
      }
      if (!pubKey) {
        throw new Error(`Invalid collection: invite but missing pubKey.`)
      }
      const ecdhPubKey = await crypt.importEcdhPubKey(pubKey)
      keys = await crypt.receiveKey(
        invitedBy,
        currentUser.ecdhPrivKey,
        ecdhPubKey,
        invite
      )
      // TODO: save decrypted key to remote...
      // FIXME: encrypt key with master key and save to remote...
    } else if (key) {
      const { payload } = await crypt.decrypt<string>(
        currentUser.id,
        currentUser.encryptionKey,
        key
      )
      keys.encrypt = payload
      keys.encryptionKey = await crypt.importEncryptionKey(keys.encrypt)
    } else {
      throw new Error(
        `Invalid collection '${id}': does not have key or invite for current user '${
          currentUser.id
        }'.`
      )
    }
  }
  currentUser.collectionKeys[id] = keys.encryptionKey
  currentUser.collections[id] = keys.encrypt
  return keys
}

export async function shareKeyWithUser(
  currentUser: UserWithKeys,
  user: RawUser,
  encrypt: string
) {
  const otherKeys = crypt.verifyAndParse<PublicKeys>(user.id, user.publicKeys)
    .payload
  if (!otherKeys) {
    throw new Error(
      `Cannot get public keys for user '${user.id}: invalid signature.`
    )
  }
  const ecdhPubKey = await crypt.importEcdhPubKey(otherKeys.ecdhPub)
  return crypt.sendKey(
    currentUser.signKey,
    currentUser.ecdhPrivKey,
    ecdhPubKey,
    encrypt
  )
}
