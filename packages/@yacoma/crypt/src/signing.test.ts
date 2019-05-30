import * as crypt from './'
import { base64ToBuffer, bufferToNative, nativeToBuffer } from './encoding'
import { SigningKeys } from './signing'

let signing: SigningKeys

describe('signing', () => {
  beforeAll(async () => {
    signing = await crypt.signingKeysFromWordList(['foo', 'bar'])
  })

  it('it should create signing keys with seed', async () => {
    const keys = await crypt.signingKeysFromWordList(['foo', 'bar'])
    expect(keys.signKey.length).toBe(64)
    expect(keys.verifyKey.length).toBe(32)
    expect(keys.sign).toBe(
      'w8l5K_pVbD0tzsFAgtt_F2tpETc3PIu2G1wbBYhZXE33d13sAGcf5YEzJdFAdaySydihk-PZM2LfkRNZpwNYyQ'
    )
    expect(keys.verify).toBe('93dd7ABnH-WBMyXRQHWsksnYoZPj2TNi35ETWacDWMk')
  })

  it('should sign and verify with Uint8Array key', () => {
    const content = { foo: 'bar' }
    const signed = crypt.sign(signing.signKey, content)
    const { payload } = crypt.verifyAndParse<typeof content>(
      signing.verifyKey,
      signed
    )
    expect(payload).toEqual(content)
  })

  it('should sign binary and verify binary', () => {
    const content = { foo: 'bar' }
    const signed = crypt.signBinary(signing.signKey, nativeToBuffer(content))
    const { buffers } = crypt.verifyBinary(signing.verifyKey, signed)
    expect(bufferToNative(buffers[0])).toEqual(content)
  })

  it('it should sign and verify a number', () => {
    const content = 870384
    const signed = crypt.sign(signing.signKey, content)
    const { payload } = crypt.verifyAndParse<typeof content>(
      signing.verifyKey,
      signed
    )
    expect(payload).toEqual(content)
  })

  it('should sign and verify with base64 encoded keys', () => {
    const content = { foo: 'bar' }
    const signed = crypt.sign(signing.sign, content)
    const { payload } = crypt.verifyAndParse<typeof content>(
      signing.verify,
      signed
    )
    expect(payload).toEqual(content)
  })

  it('should sign and extract headers with additional headers', () => {
    const now = Date.now()
    const signed = crypt.sign(signing.sign, now, { userId: signing.verify })
    const { userId } = crypt.extractHeader(signed).headers
    expect(userId).toEqual(signing.verify)
    expect(crypt.verifyAndParse(userId, signed).payload).toEqual(now)
  })

  it('should sign and extract headers from buffer', () => {
    const now = Date.now()
    const signed = crypt.sign(signing.sign, now, { userId: signing.verify })
    const { userId } = crypt.extractHeader(base64ToBuffer(signed)).headers
    expect(userId).toEqual(signing.verify)
    expect(crypt.verifyAndParse(userId, signed).payload).toEqual(now)
  })

  it('should sign and extract empty headers', () => {
    const signed = crypt.sign(signing.sign, 'anything')
    const headers = crypt.extractHeader(signed).headers
    expect(headers).toEqual({})
  })

  it('should throw when using wrong key', async () => {
    const otherSigning = await crypt.signingKeysFromWordList(['other', 'words'])
    const content = 870384
    const signed = crypt.sign(signing.signKey, content)
    let error = 'did not throw'
    try {
      crypt.verify(otherSigning.verifyKey, signed)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(`Invalid signature`)
  })

  it('should throw during verification on invalid buffer', () => {
    let error = 'did not throw'
    try {
      crypt.verify(signing.verifyKey, 'foooooooo')
    } catch (e) {
      error = e.message
    }
    expect(error).toMatch(/Invalid buffer/)
  })

  it('should throw during header extraction on invalid data', () => {
    let error = 'did not throw'
    try {
      crypt.extractHeader('foooooooo')
    } catch (e) {
      error = e.message
    }
    expect(error).toMatch(/Invalid buffer/)
  })

  it('should create and verify signature without payload', () => {
    const content = { hey: 'Joe', ILove: 'You' }
    const signature = crypt.getSignature(signing.signKey, content)
    let error = 'did not throw'
    try {
      crypt.verifySignature(signing.verifyKey, content, signature)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('did not throw')
  })

  it('should extract headers from signature without payload', () => {
    const content = { hey: 'Joe', ILove: 'You' }
    const signature = crypt.getSignature(signing.signKey, content, 1)
    const { headers } = crypt.extractHeader(signature)
    expect(headers).toEqual(1)
  })

  it('should throw on invalid verify signature without payload', () => {
    const content = { hey: 'Joe', ILove: 'You' }
    const signature = crypt.getSignature(signing.signKey, content)
    let error = 'did not throw'
    try {
      crypt.verifySignature(signing.verifyKey, { other: 'content' }, signature)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('Invalid signature')
  })
})
