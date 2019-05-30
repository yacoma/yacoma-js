import { receiveKey } from '@yacoma/crypt'
import { createUser } from '../helpers/User'
import { UserWithKeys } from '../types'
import { shareKeyWithUser } from './keys'

let user1: UserWithKeys
let user2: UserWithKeys

describe('inviteUser', () => {
  beforeAll(async () => {
    const r1 = await createUser(['one', 'two'])
    user1 = r1.user
    const r2 = await createUser(['four', 'five'])
    user2 = r2.user
  })

  it('should share key with user', async () => {
    const originalKey = 'hello world'
    // owner (user1) invites admin (user2)
    const invite = await shareKeyWithUser(user1, user2.user, originalKey)
    // admin (user2) decrypts invite from owner (user1)
    const { encrypt } = await receiveKey(
      user1.id,
      user2.ecdhPrivKey,
      user1.ecdhPubKey,
      invite
    )
    expect(encrypt).toBe(originalKey)
  })
})
