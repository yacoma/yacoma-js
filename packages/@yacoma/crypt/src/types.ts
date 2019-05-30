// This **MUST** change if there are any breaking changes in API and the old
// version must be kept.
export const CRYPT_VERSION = 1

export interface EncryptedPayload {
  compress?: boolean
  buffer?: boolean
  iv: string
  cipher: string
}

export interface ClearPayload<T = any> {
  // extra fields passed as options
  payload: T
}
