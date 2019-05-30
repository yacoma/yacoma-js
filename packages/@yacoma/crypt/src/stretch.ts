import { stringToBuffer } from './encoding'
import { encAlgo } from './encryption'

const salt = stringToBuffer(
  `But my dear man, reality is only a Rorschach ink-blot, you know.`
)
const iterations = 10000

export function stretch(derivableKey: CryptoKey) {
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    derivableKey,
    encAlgo,
    true, // extractable
    ['decrypt', 'encrypt']
  )
}
