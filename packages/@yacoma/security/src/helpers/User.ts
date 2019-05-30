import * as crypt from '@lucidogen/crypt'
import { PairCollection, RawUser, User, UserWithKeys } from '../types'
import { createCollection } from './Collection'
import { privateCollectionId } from './Item/makeId'
import { remoteNow, timeSkewCheck, TOKEN_TTL } from './time'

export interface WordKeys {
  encrypt: string
  sign: string
}

export interface PrivateKeys {
  // We need the master encrypt key when privateKeys are encrypted with
  // session key.
  encrypt: string
  ecdhPriv: string
  sign: string
}

export interface PublicKeys {
  ecdhPub: string
  // We do not add the verify key as it is
  // already in `id` and signing a key with
  // itself does not add any security.
}

export async function userFromWordList(
  wordList: string[]
): Promise<UserWithKeys> {
  const signing = await crypt.signingKeysFromWordList(wordList)
  const encrypt = await crypt.encryptionKeyFromWordList(wordList)
  const messaging = await crypt.createMessagingKeys()
  const publicKeys: PublicKeys = {
    ecdhPub: messaging.ecdhPub,
  }
  const signedPublicKeys = crypt.sign(signing.signKey, publicKeys)
  const privateKeys: PrivateKeys = {
    encrypt: encrypt.encrypt,
    sign: signing.sign,
    ecdhPriv: messaging.ecdhPriv,
  }

  const encryptedPrivateKeys = await crypt.encrypt(
    signing.signKey,
    encrypt.encryptionKey,
    privateKeys
  )
  const user: RawUser = {
    id: signing.verify,
    type: 'User',
    savedAt: new Date().toISOString(),
    publicKeys: signedPublicKeys,
    privateKeys: encryptedPrivateKeys,
  }
  return Object.assign(
    {
      id: user.id,
      collections: {},
      collectionKeys: {},
    },
    { user },
    signing,
    messaging,
    encrypt
  )
}

export function createToken(
  user: { id: string; sign: string | Uint8Array },
  sessionId: string
): { token: string; expire: number } {
  const now = remoteNow()
  return {
    token: crypt.sign(
      user.sign,
      { createdAt: now, sessionId },
      {
        userId: user.id,
      }
    ),
    expire: now + TOKEN_TTL,
  }
}

export function extractToken(
  token: string
): { userId: string | null; [key: string]: any } {
  let userId: string

  try {
    const info = crypt.extractHeader<{ userId: string }>(token).headers
    userId = info.userId
  } catch (e) {
    // Invalid toke
    throw new Error(`Invalid token (invalid buffer).`)
  }

  const now = Date.now()
  const { payload } = crypt.verifyAndParse<{
    createdAt: number
    sessionId: string
    [key: string]: any
  }>(userId, token)
  if (!payload || !payload.createdAt) {
    throw new Error(`Invalid token (missing createdAt).`)
  }
  const msg = timeSkewCheck(now, 'token', payload.createdAt, TOKEN_TTL)
  if (msg) {
    throw new Error(msg)
  }
  delete payload.createdAt
  return Object.assign({}, payload, { userId })
}

export async function encryptWordKeys(
  signKey: string | Uint8Array,
  sessionKey: CryptoKey,
  user: WordKeys
) {
  const keys: WordKeys = {
    encrypt: user.encrypt,
    sign: user.sign,
  }
  return crypt.encrypt(signKey, sessionKey, keys)
}

// Takes keys encrypted with sessionKey
export async function decryptWordKeys(
  sessionKey: string,
  userId: string,
  keys: string
): Promise<WordKeys & { signKey: Uint8Array; encryptionKey: CryptoKey }> {
  const key = await crypt.importEncryptionKey(sessionKey)
  const { payload } = await crypt.decrypt<WordKeys>(userId, key, keys)
  const signKey = crypt.importSignKey(payload.sign)
  const encryptionKey = await crypt.importEncryptionKey(payload.encrypt)
  return {
    signKey,
    sign: payload.sign,
    encryptionKey,
    encrypt: payload.encrypt,
  }
}

export async function decryptUser(
  masterKey: CryptoKey,
  user: User
): Promise<UserWithKeys> {
  const { payload } = await crypt.decrypt<PrivateKeys>(
    user.id,
    masterKey,
    user.privateKeys
  )
  const signKey = crypt.importSignKey(payload.sign)
  const encryptionKey = await crypt.importEncryptionKey(payload.encrypt)
  const ecdhPrivKey = await crypt.importEcdhPrivKey(payload.ecdhPriv)

  const pubKeys = crypt.verifyAndParse<PublicKeys>(user.id, user.publicKeys)
    .payload
  if (!pubKeys) {
    throw new Error(`Invalid user: publicKeys not signed by user.`)
  }
  const ecdhPubKey = await crypt.importEcdhPubKey(pubKeys.ecdhPub)

  return Object.assign({}, user, {
    user,
    encrypt: payload.encrypt,
    encryptionKey,
    sign: payload.sign,
    signKey,
    ecdhPriv: payload.ecdhPriv,
    ecdhPrivKey,
    ecdhPub: pubKeys.ecdhPub,
    ecdhPubKey,
    collections: {},
    collectionKeys: {},
  })
}

export async function createUser(
  wordList: string[],
  info: {
    username: string
    domain: string
    admin?: boolean
    protected?: boolean
    email?: string
  } = { username: '', domain: 'none' }
) {
  const user = await userFromWordList(wordList)
  // Add missing fields to userWithKeys like 'admin' and 'domain'.
  Object.assign(user, info)
  // Transform the internal RawUser to a full User as complete as possible.
  Object.assign(user.user, info)

  const privateCollection = await createCollection(
    user,
    {
      type: 'PrivateCollection',
      id: privateCollectionId(user.id),
    },
    {
      title: info.username,
    }
  )
  return { user, privateCollection }
}

export function otherUserIdFromPairCollection(
  uid: string,
  collection: PairCollection
): string {
  const ids = Object.keys(collection.userAccess)
  return ids[0] === uid ? ids[1] : ids[0]
}
