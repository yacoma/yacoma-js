import { bufferToBase64url } from './encoding'

/** id length = Math.ceil(4/3 * length). Use a multiple of 3 to avoid
 * padding.
 */
export function makeId(length: number = 33): string {
  const randBytes = new Uint8Array(length)
  crypto.getRandomValues(randBytes)
  return bufferToBase64url(randBytes)
}
