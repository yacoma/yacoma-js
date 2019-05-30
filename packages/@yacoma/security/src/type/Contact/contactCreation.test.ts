import { describe, expect, it } from 'test'
import { BaseUser } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as BaseUser
const now: number = Date.now()

describe('Contact creation', () => {
  it('should only allow from admin', () => {
    expect(
      validate.contactCreation({
        now,
        currentUser: { admin: true } as any,
        oldRecord: undefined,
        newRecord: { type: 'Contact' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.contactCreation({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Contact' } as any,
      })
    ).toBe(`Contact: only admin users can create contacts`)
  })
})
