import { base64ToBuffer, bufferToBase64 } from './encoding'
import {
  decrypt,
  encAlgo,
  encrypt,
  EncryptionKeys,
  importEncryptionKey,
} from './encryption'

const subtle = crypto.subtle

const mesAlgo = {
  name: 'ECDH',
  namedCurve: 'P-256',
}

export interface MessagingKeys {
  // 'send' renamed to 'ecdhPub'
  ecdhPub: string
  // 'receive' renamed to 'ecdhPriv'
  ecdhPriv: string
  ecdhPubKey: CryptoKey
  ecdhPrivKey: CryptoKey
}

export function createMessagingKeys(): Promise<MessagingKeys> {
  return new Promise((resolve, reject) =>
    subtle.generateKey(mesAlgo, true, ['deriveKey']).then(pair =>
      // export
      subtle
        .exportKey('raw', pair.publicKey)
        // make a string
        .then(keyBuffer => {
          const send = bufferToBase64(new Uint8Array(keyBuffer))
          const sendKey = pair.publicKey
          return subtle.exportKey('pkcs8', pair.privateKey).then(keyBuffer => {
            const receive = bufferToBase64(new Uint8Array(keyBuffer))
            const receiveKey = pair.privateKey
            resolve({
              ecdhPub: send,
              ecdhPubKey: sendKey,
              ecdhPriv: receive,
              ecdhPrivKey: receiveKey,
            })
          }, reject)
        })
    )
  )
}

/** Import our own private ECDH key.
 */
export function importEcdhPrivKey(key: string): Promise<CryptoKey> {
  return new Promise((resolve, reject) =>
    subtle
      .importKey('pkcs8', base64ToBuffer(key), mesAlgo, false, ['deriveKey'])
      .then(resolve, reject)
  )
}

/** Import another user's public ECDH key.
 */
export function importEcdhPubKey(key: string): Promise<CryptoKey> {
  return new Promise((resolve, reject) =>
    subtle
      .importKey('raw', base64ToBuffer(key), mesAlgo, false, [])
      .then(resolve, e => {
        reject(`Cannot import ECDH public key (invalid key).`)
      })
  )
}

export function deriveKey(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return new Promise((resolve, reject) =>
    subtle
      .deriveKey(
        Object.assign({}, mesAlgo, { public: publicKey }),
        privateKey,
        encAlgo,
        // no need for extraction
        true,
        ['encrypt', 'decrypt']
      )
      .then(resolve, reject)
  )
}

/** Encrypt and sign a base64url string with the shared ECDH key.
 */
export function sendKey(
  // private key
  signKey: Uint8Array | string,
  // Our own private ECDH key
  privateKey: CryptoKey,
  // Remote user's public key
  publicKey: CryptoKey,
  // base64url encoded key to send
  key: string
): Promise<string> {
  return deriveKey(privateKey, publicKey).then(derivedKey =>
    encrypt(signKey, derivedKey, key)
  )
}

export function receiveKey(
  // public verification key
  verifyKey: Uint8Array | string,
  // Our own private ECDH key
  privateKey: CryptoKey,
  // Remote user's public key
  publicKey: CryptoKey,
  cipher: string
): Promise<EncryptionKeys> {
  return deriveKey(privateKey, publicKey).then(secretKey =>
    decrypt(verifyKey, secretKey, cipher).then(({ payload }) =>
      importEncryptionKey(payload).then(encryptionKey => ({
        encrypt: payload,
        encryptionKey,
      }))
    )
  )
}
