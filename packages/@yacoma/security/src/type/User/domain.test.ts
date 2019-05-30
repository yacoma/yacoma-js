import { describe, expect, it } from 'test'
import { BaseUser } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
  domain: 'someDomain',
} as BaseUser
const now: number = Date.now()

describe('User.domain', () => {
  it('should not validate without domain in current user', () => {
    expect(
      validate.domain({
        now,
        currentUser: {} as any,
        oldRecord: undefined,
        newRecord: { domain: 'someDomain' } as any,
      })
    ).toBe('domain: cannot validate (domain not set in current user)')
  })

  it('should inherit from creator', () => {
    expect(
      validate.domain({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { domain: 'someDomain' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.domain({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { domain: 'otherDomain' } as any,
      })
    ).toBe(`domain: must be inherited from creator`)
  })

  it('should not change', () => {
    expect(
      validate.domain({
        now,
        currentUser,
        oldRecord: { domain: 'aDomain' } as any,
        newRecord: { domain: 'aDomain' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.domain({
        now,
        currentUser,
        oldRecord: { domain: 'aDomain' } as any,
        newRecord: { domain: 'anotherDomain' } as any,
      })
    ).toBe(`domain: cannot be changed`)
  })
})
