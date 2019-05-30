import { beforeAll, describe, expect, it } from 'test'
import * as crypt from './'
import { MessagingKeys } from './messaging'
import { SigningKeys } from './signing'
import { base64ToBuffer, bufferToBase64 } from './encoding'

let user1: MessagingKeys
let user2: MessagingKeys
let signing: SigningKeys

describe('messaging', () => {
  beforeAll(async () => {
    signing = await crypt.signingKeysFromWordList(['foo', 'bar'])
    user1 = await crypt.createMessagingKeys()
    user2 = await crypt.createMessagingKeys()
  })

  it('it should send and receive a key', async () => {
    const original = await crypt.createEncryptionKey()
    const invite = await crypt.sendKey(
      signing.signKey,
      user1.ecdhPrivKey,
      user2.ecdhPubKey,
      original.encrypt
    )
    const received = await crypt.receiveKey(
      signing.verifyKey,
      user2.ecdhPrivKey,
      user1.ecdhPubKey,
      invite
    )
    expect(received.encrypt).toBe(original.encrypt)
  })

  it('it should verify key signature', async () => {
    const original = await crypt.createEncryptionKey()
    const other = await crypt.signingKeysFromWordList(['bob'])
    const invite = await crypt.sendKey(
      other.signKey,
      user1.ecdhPrivKey,
      user2.ecdhPubKey,
      original.encrypt
    )
    let error: string = 'did not throw'
    try {
      await crypt.receiveKey(
        signing.verifyKey,
        user2.ecdhPrivKey,
        user1.ecdhPubKey,
        invite
      )
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('Invalid signature')
  })

  it('it should import public key', async () => {
    const original = await crypt.createEncryptionKey()
    const key = await crypt.importEcdhPubKey(user2.ecdhPub)
    const invite = await crypt.sendKey(
      signing.signKey,
      user1.ecdhPrivKey,
      key,
      original.encrypt
    )
    const received = await crypt.receiveKey(
      signing.verifyKey,
      user2.ecdhPrivKey,
      user1.ecdhPubKey,
      invite
    )
    expect(received.encrypt).toBe(original.encrypt)
  })

  it('it should import private key', async () => {
    const original = await crypt.createEncryptionKey()
    const invite = await crypt.sendKey(
      signing.signKey,
      user1.ecdhPrivKey,
      user2.ecdhPubKey,
      original.encrypt
    )
    const key = await crypt.importEcdhPrivKey(user2.ecdhPriv)
    const received = await crypt.receiveKey(
      signing.verifyKey,
      key,
      user1.ecdhPubKey,
      invite
    )
    expect(received.encrypt).toBe(original.encrypt)
  })

  it('it should throw in invalid public key', async () => {
    let error = 'did not throw'
    const buff = base64ToBuffer(user2.ecdhPub)
    // Make key invalid
    buff[1] = 4
    try {
      await crypt.importEcdhPubKey(bufferToBase64(buff))
    } catch (e) {
      error = e
    }
    expect(error).toBe(`Cannot import ECDH public key (invalid key).`)
  })
})
