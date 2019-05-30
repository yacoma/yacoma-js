import base64url from 'base64url'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

// ========== string ==> Uint8Array

/** Convert a string to an array buffer.
 */
export function stringToBuffer(str: string): Uint8Array {
  return encoder.encode(str)
}

// ========== PAYLOAD <==> Uint8Array

/** Convert payload (JS native type) to an array buffer.
 */
export function nativeToBuffer(payload: any): Uint8Array {
  return encoder.encode(JSON.stringify(payload))
}

/** Restore payload (JS native type) from an array buffer.
 */
export function bufferToNative(buffer: Uint8Array): any {
  return JSON.parse(decoder.decode(buffer))
}

// ========== Uint8Array <==> Base64url (for key export)

/** Convert a buffer to a Base64url string.
 */
export function bufferToBase64url(buffer: Uint8Array): string {
  return base64url.encode(Buffer.from(buffer))
}

/** Restore a buffer from a Base64url string.
 */
export function base64urlToBuffer(string64: string): Uint8Array {
  return base64url.toBuffer(string64)
}

// ========== Uint8Array <==> Base64

/** Convert a buffer to a Base64 string.
 */
export function bufferToBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('base64')
}

/** Restore a buffer from a Base64 string.
 */
export function base64ToBuffer(string64: string): Uint8Array {
  return new Uint8Array(Buffer.from(string64, 'base64'))
}

/** String hashing.
 */
export async function hash(payload: string | Uint8Array): Promise<Uint8Array> {
  const buffer = typeof payload === 'string' ? stringToBuffer(payload) : payload
  const result = await crypto.subtle.digest({ name: 'SHA-256' }, buffer)
  return new Uint8Array(result)
}
