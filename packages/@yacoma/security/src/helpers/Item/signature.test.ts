import * as crypt from '@lucidogen/crypt'
import { describe, expect, it } from 'test'
import * as security from '../'
import { Item, itemAccessValue } from '../../types'

describe('itemSignature', () => {
  it('should get and veryfy itemSignature', async () => {
    const wordList = [
      'boyfriend',
      'fruit',
      'banjo',
      'enjoy',
      'palace',
      'software',
    ]
    const user = await security.userFromWordList(wordList)
    const now = Date.now()
    const nowISO = new Date(now).toISOString()
    const operation = {
      changedAt: now,
      previous: 'i.123',
      type: 'user',
      id: user.id,
      operation: 'add',
      access: itemAccessValue.admin,
    }
    const signedOperation = crypt.sign(user.signKey, operation)
    const item = {
      id: 'i.123',
      type: 'Item',
      accessChangedBy: user.id,
      accessChangedAt: nowISO,
      revision: 1,
      collectionAccess: { ['p.' + user.id]: { key: 'xxx', signedBy: 'xxx' } },
      userAccess: {
        [user.id]: {
          access: itemAccessValue.admin,
        },
      },
      accessChangeLog: [
        {
          changedBy: user.id,
          operation: signedOperation,
        },
      ],
    } as Item
    const signature = await security.getSignature(user.signKey, item)
    let error = 'did not throw'
    try {
      await security.verifySignature(item, signature)
    } catch (err) {
      error = err.message
    }
    expect(error).toBe('did not throw')

    item.revision = 2
    try {
      await security.verifySignature(item, signature)
    } catch (err) {
      error = err.message
    }
    expect(error).toBe('Invalid signature')
  })
})
