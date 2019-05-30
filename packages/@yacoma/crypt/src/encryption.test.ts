import * as crypt from './'
import { bufferToNative, nativeToBuffer } from './encoding'
import { encAlgo, EncryptionKeys } from './encryption'
import { SigningKeys } from './signing'

const quotes = [
  'He who has a why to live can bear almost any how.',
  'He who fights with monsters might take care lest he thereby become a monster. And if you gaze for long into an abyss, the abyss gazes also into you.',
  'The individual has always had to struggle to keep from being overwhelmed by the tribe. If you try it, you will be lonely often, and sometimes frightened. But no price is too high to pay for the privilege of owning yourself.',
]

let signing: SigningKeys
let encryption: EncryptionKeys

describe('encryption', () => {
  beforeAll(async () => {
    signing = await crypt.signingKeysFromWordList(['foo', 'bar'])
    encryption = await crypt.createEncryptionKey()
  })

  it('it should encrypt and decrypt an object', async () => {
    const content = { foo: 'bar' }
    const cipher = await crypt.encrypt(
      signing.signKey,
      encryption.encryptionKey,
      content
    )
    const clear = await crypt.decrypt<typeof content>(
      signing.verifyKey,
      encryption.encryptionKey,
      cipher
    )
    expect(clear.payload).toEqual(content)
  })

  it('it should encrypt and decrypt an object with clear options', async () => {
    const content = { foo: 'bar' }
    const options = { clear: 'information' }
    const cipher = await crypt.encrypt(
      signing.signKey,
      encryption.encryptionKey,
      content,
      options
    )

    // Clear options (unencrypted)
    const verified = await crypt.verify(signing.verifyKey, cipher)
    expect(verified.headers).toEqual({
      clear: 'information',
    })

    // Decrypt
    const clear = await crypt.decrypt<typeof content, typeof options>(
      signing.verifyKey,
      encryption.encryptionKey,
      cipher
    )
    expect(clear).toEqual({
      payload: content,
      headers: { clear: 'information' },
    })
  })

  it('should throw error on invalid payload', async () => {
    const signed = await crypt.sign(signing.signKey, 'some string')
    let error = 'did not throw'
    try {
      await crypt.decrypt(signing.verifyKey, encryption.encryptionKey, signed)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(`Cannot decrypt: invalid payload.`)
  })

  it('should throw error on invalid signature', async () => {
    const other = await crypt.signingKeysFromWordList(['other'])
    const cipher = await crypt.sign(other.signKey, 'some string')
    let error = 'did not throw'
    try {
      await crypt.decrypt(signing.verifyKey, encryption.encryptionKey, cipher)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(`Invalid signature`)
  })

  it('should import encryption key', async () => {
    const cryptoKey = await crypt.importEncryptionKey(encryption.encrypt)
    expect({
      type: cryptoKey.type,
      extractable: cryptoKey.extractable,
      algorithm: cryptoKey.algorithm,
    }).toEqual({
      type: 'secret',
      extractable: false,
      algorithm: encAlgo,
    })
  })

  it('it should encrypt and decrypt binary', async () => {
    const content = nativeToBuffer(quotes)
    const data = await crypt.encryptBinary(
      signing.signKey,
      encryption.encryptionKey,
      content
    )
    const clear = await crypt.decryptBinary(
      signing.verifyKey,
      encryption.encryptionKey,
      data
    )
    expect(bufferToNative(clear.payload)).toEqual(quotes)
  })
})
