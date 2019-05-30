import {
  ByteArray,
  sign_detached as signDetached,
  sign_detached_verify as signDetachedVerify,
  sign_keyPair_fromSeed as signKeyPairFromSeed,
} from 'tweetnacl-ts'
import { getBuffer, getBuffers } from './buffers'
import {
  base64ToBuffer,
  bufferToBase64,
  bufferToBase64url,
  hash,
  nativeToBuffer,
  bufferToNative,
  base64urlToBuffer,
} from './encoding'
import { stretch } from './stretch'
export const importSignKey = base64ToBuffer

const SIGNATURE_LENGTH = 64
const DUMMY_SIGNATURE = new Uint8Array(SIGNATURE_LENGTH)
const EMPTY_HEADERS = new Uint8Array(0)

// alg = edDSA

export interface SigningKeys {
  sign: string
  verify: string
  signKey: ByteArray
  verifyKey: ByteArray
}

function detachedVerify(
  verifyKey: Uint8Array | string,
  payload: Uint8Array,
  signature: Uint8Array
) {
  if (typeof verifyKey === 'string') {
    verifyKey = base64urlToBuffer(verifyKey)
  }

  if (!signDetachedVerify(payload, signature, verifyKey)) {
    throw new Error(`Invalid signature`)
  }
}

/** Extract signing keys from a word list.
 */
export async function signingKeysFromWordList(
  wordList: string[]
): Promise<SigningKeys> {
  return (
    hash([...wordList, 'signing'].join('-'))
      .then(sha =>
        crypto.subtle.importKey('raw', sha, 'PBKDF2', false, ['deriveKey'])
      )
      .then(key => stretch(key))
      .then(seedKey => crypto.subtle.exportKey('raw', seedKey))
      // make a string
      .then(keyBuffer => bufferToBase64(new Uint8Array(keyBuffer)))
      // create a 32-byte hash
      .then(encodedKey => hash(encodedKey))
      .then(seed => signKeyPairFromSeed(seed))
      .then(({ secretKey, publicKey }) => ({
        sign: bufferToBase64url(secretKey),
        verify: bufferToBase64url(publicKey),
        signKey: secretKey,
        verifyKey: publicKey,
      }))
  )
}

export function signBinary(
  signKey: Uint8Array | string,
  buffers: Uint8Array[] | Uint8Array,
  headers?: any
): Uint8Array {
  if (!Array.isArray(buffers)) {
    buffers = [buffers]
  }

  if (typeof signKey === 'string') {
    signKey = base64urlToBuffer(signKey)
  }

  const headersBuffer = headers ? nativeToBuffer(headers) : EMPTY_HEADERS

  const { buffer, offset } = getBuffer([
    DUMMY_SIGNATURE,
    headersBuffer,
    ...buffers,
  ])

  const signature = signDetached(
    new Uint8Array(buffer.buffer, offset + SIGNATURE_LENGTH),
    signKey
  )
  buffer.set(signature, offset)

  return buffer
}

/* Return the signature without the last buffer (payload), but keeping
 * other buffers. This enables header and signature extraction but
 * needs a payload to verify signature.
 * 
 * We return a base64 string to make sure the buffer is not used fully (shared
 * buffer bytes).
 */
export function getSignature(
  signKey: Uint8Array | string,
  payload: any,
  headers?: any
): string {
  const payloadBuffer = nativeToBuffer(payload)
  const signed = signBinary(signKey, payloadBuffer, headers)
  return bufferToBase64(
    new Uint8Array(
      signed.buffer,
      0,
      signed.byteLength - payloadBuffer.byteLength
    )
  )
}

export function sign(
  signKey: Uint8Array | string,
  payload: any,
  headers?: { [key: string]: any }
): string {
  return bufferToBase64(signBinary(signKey, nativeToBuffer(payload), headers))
}

/** Verify content and return the same buffers passed to signBinary
 * (without signature and headersBuffer)
 */
export function verifyBinary<Headers = {}>(
  verifyKey: Uint8Array | string,
  buffer: Uint8Array
): { buffers: Uint8Array[]; headers: Headers } {
  const { buffers, offset } = getBuffers(buffer)
  const [signature, headersBuffer] = buffers
  const headers =
    headersBuffer.byteLength > 0 ? bufferToNative(headersBuffer) : {}

  detachedVerify(
    verifyKey,
    // We sign/verify everything after the first buffer which is the signature
    new Uint8Array(buffer.buffer, offset + SIGNATURE_LENGTH),
    signature
  )
  return { headers, buffers: buffers.slice(2) }
}

/** Verify content with separate payload and signature.
 */
export function verifySignature(
  verifyKey: Uint8Array | string,
  payload: any,
  signature: Uint8Array | string
) {
  const sigBuff =
    typeof signature === 'string' ? base64ToBuffer(signature) : signature
  const payloadBuffer = nativeToBuffer(payload)
  const buffer = new Uint8Array(sigBuff.byteLength + payloadBuffer.byteLength)
  buffer.set(sigBuff)
  buffer.set(payloadBuffer, sigBuff.byteLength)
  return verifyBinary(verifyKey, buffer)
}

export function verify<Headers = {}>(
  verifyKey: Uint8Array | string,
  cipher: string
): { buffers: Uint8Array[]; headers: Headers } {
  return verifyBinary<Headers>(verifyKey, base64ToBuffer(cipher))
}

export function verifyAndParse<T = {}, Headers = {}>(
  verifyKey: Uint8Array | string,
  cipher: string
): { payload: T; headers: Headers } {
  const { headers, buffers } = verify<Headers>(verifyKey, cipher)
  const [payload] = buffers

  return { headers, payload: bufferToNative(payload) }
}

export function extractHeader<Headers = any>(
  cipher: Uint8Array | string
): { headers: Headers; buffer: Uint8Array; signature: Uint8Array } {
  const buffer = typeof cipher === 'string' ? base64ToBuffer(cipher) : cipher
  const { buffers } = getBuffers(buffer)
  const [signature, headersBuffer] = buffers
  const headers =
    headersBuffer.byteLength > 0 ? bufferToNative(headersBuffer) : {}
  return { headers, buffer, signature }
}
