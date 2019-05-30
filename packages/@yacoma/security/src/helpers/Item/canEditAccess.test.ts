import { describe, expect, it } from 'test'

import { canEditAccess } from './'
import { itemAccessValue } from '../../types'

describe('Item.canEditAccess', () => {
  it('should return true if user has admin access', () => {
    const item = {
      userAccess: {
        someId: {
          access: 'a',
        },
      },
    }
    expect(canEditAccess({ id: 'someId' } as any, item as any)).toBe(true)
  })

  it('should return false if user does not have admin access', () => {
    const item = {
      userAccess: {
        someId: {
          access: itemAccessValue.editor,
        },
      },
    }
    expect(canEditAccess({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should return false if user is not in userAccess', () => {
    const item = {
      userAccess: {
        otherId: {
          access: itemAccessValue.admin,
        },
      },
    }
    expect(canEditAccess({ id: 'someId' } as any, item as any)).toBe(false)
  })
})
