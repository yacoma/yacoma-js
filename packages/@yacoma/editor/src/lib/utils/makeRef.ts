import { makeId } from '@lucidogen/crypt'

// makeId takes the number of bytes and encodes it with base64
// ==> multiplies by 4/3
const LEN = 5

export function makeRef() {
  return makeId(LEN).slice(0, 6)
}
