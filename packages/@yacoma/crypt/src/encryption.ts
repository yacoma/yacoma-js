import pako from 'pako'
import {
  base64ToBuffer,
  bufferToBase64,
  bufferToNative,
  hash,
  nativeToBuffer,
} from './encoding'
import { signBinary, verifyBinary } from './signing'
import { stretch } from './stretch'

export const encAlgo: AesKeyGenParams = {
  name: 'AES-CBC',
  // https://www.schneier.com/blog/archives/2011/08/new_attack_on_a_1.html
  length: 128,
}
const IV_LENGTH = 16

export interface EncryptionKeys {
  encrypt: string
  encryptionKey: CryptoKey
}

export function createEncryptionKey(): Promise<EncryptionKeys> {
  return new Promise((resolve, reject) =>
    crypto.subtle
      .generateKey(encAlgo, true, ['decrypt', 'encrypt'])
      // export
      .then(cryptoKey => {
        crypto.subtle
          .exportKey('raw', cryptoKey)
          // make a string
          .then(keyBuffer => {
            const key: string = bufferToBase64(new Uint8Array(keyBuffer))
            resolve({
              encrypt: key,
              encryptionKey: cryptoKey,
            })
          }, reject)
      }, reject)
  )
}

export function encryptionKeyFromWordList(
  wordList: string[]
): Promise<EncryptionKeys> {
  return hash([...wordList, 'master'].join('-'))
    .then(sha =>
      crypto.subtle.importKey('raw', sha, 'PBKDF2', false, ['deriveKey'])
    )
    .then(key => stretch(key))
    .then(encryptionKey =>
      crypto.subtle
        .exportKey('raw', encryptionKey)
        .then(keyBuffer => bufferToBase64(new Uint8Array(keyBuffer)))
        .then(encrypt => ({ encrypt, encryptionKey }))
    )
}

export function importEncryptionKey(key: string): Promise<CryptoKey> {
  return new Promise((resolve, reject) =>
    crypto.subtle
      .importKey(
        'raw',
        base64ToBuffer(key),
        encAlgo,
        // NOT exportable
        false,
        ['decrypt', 'encrypt']
      )
      .then(resolve, reject)
  )
}

// ======= BINARY

export async function encryptBinary(
  // private key
  signKey: Uint8Array | string,
  // shared key (in Collection, etc)
  encryptionKey: CryptoKey,
  // Payload can contain any native JS value
  payload: Uint8Array,
  headers?: { [key: string]: any }
): Promise<Uint8Array> {
  const iv = new Uint8Array(IV_LENGTH)
  crypto.getRandomValues(iv)
  return new Promise<Uint8Array>((resolve, reject) =>
    crypto.subtle
      .encrypt(
        Object.assign({ iv }, encAlgo),
        encryptionKey,
        pako.deflate(payload)
      )
      .then(
        cipher =>
          resolve(signBinary(signKey, [iv, new Uint8Array(cipher)], headers)),
        reject
      )
  )
}

// throws on invalid signature
export async function decryptBinary<Headers>(
  // public key
  verifyKey: Uint8Array | string,
  // shared key (in Collection, etc)
  encryptionKey: CryptoKey,
  data: Uint8Array
): Promise<{ payload: Uint8Array; headers: Headers }> {
  const { buffers, headers } = await verifyBinary(verifyKey, data)
  const [iv, payload] = buffers
  if (!iv || iv.byteLength !== IV_LENGTH) {
    throw new Error(`Cannot decrypt: invalid payload.`)
  }

  return new Promise<{ payload: Uint8Array; headers: Headers }>(
    (resolve, reject) => {
      // Decrypt
      crypto.subtle
        .decrypt(Object.assign({ iv }, encAlgo), encryptionKey, payload)
        .then(
          clearText =>
            resolve({
              headers,
              payload: pako.inflate(new Uint8Array(clearText)),
            }),
          reject
        )
    }
  )
}

export async function encrypt(
  // private key
  signKey: Uint8Array | string,
  // shared key (in Collection, etc)
  encryptionKey: CryptoKey,
  // Payload can contain any native JS value
  payload: any,
  // The serialized and signed but not encrypted.
  options?: { [key: string]: any }
): Promise<string> {
  return bufferToBase64(
    await encryptBinary(
      signKey,
      encryptionKey,
      nativeToBuffer(payload),
      options
    )
  )
}

// throws on invalid signature
export async function decrypt<Payload = any, Options = {}>(
  // public key
  verifyKey: Uint8Array | string,
  // shared key (in Collection, etc)
  encryptionKey: CryptoKey,
  cipher64: string
): Promise<{ payload: Payload; headers: Options }> {
  const result = await decryptBinary<Options>(
    verifyKey,
    encryptionKey,
    base64ToBuffer(cipher64)
  )
  const { payload } = result
  return Object.assign({}, result, {
    payload: bufferToNative(payload),
  })
}
