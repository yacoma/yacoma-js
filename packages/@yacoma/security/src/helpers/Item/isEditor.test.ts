import { describe, expect, it } from 'test'

import { isEditor } from './'
import { itemAccessValue } from '../../types'

describe('Item.isEditor', () => {
  it('should return true if user has edit access', () => {
    const item = {
      userAccess: {
        someId: {
          access: 'e',
        },
      },
    }
    expect(isEditor({ id: 'someId' } as any, item as any)).toBe(true)
  })

  it('should return false if user does not have edit access', () => {
    const item = {
      userAccess: {
        someId: {
          access: 'a',
        },
      },
    }
    expect(isEditor({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should return false if user is not in userAccess', () => {
    const item = {
      userAccess: {
        otherId: {
          access: itemAccessValue.admin,
        },
      },
    }
    expect(isEditor({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should throw when userAccess field is not set', () => {
    const item = {}
    expect(() => isEditor({ id: 'someId' } as any, item as any)).toThrow(
      '"userAccess" field is not set.'
    )
  })
})
