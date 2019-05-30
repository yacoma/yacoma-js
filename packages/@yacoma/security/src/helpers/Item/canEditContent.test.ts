import { describe, expect, it } from 'test'

import { canEditContent } from './'
import { itemAccessValue } from '../../types'

describe('Item.canEditContent', () => {
  it('should return true if user has edit access', () => {
    const item = {
      userAccess: {
        someId: {
          access: itemAccessValue.editor,
        },
      },
    }
    expect(canEditContent({ id: 'someId' } as any, item as any)).toBe(true)
  })

  it('should return false if user does not have edit access', () => {
    const item = {
      userAccess: {
        someId: {
          access: 'a',
        },
      },
    }
    expect(canEditContent({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should return false if user is not in userAccess', () => {
    const item = {
      userAccess: {
        otherId: {
          access: itemAccessValue.admin,
        },
      },
    }
    expect(canEditContent({ id: 'someId' } as any, item as any)).toBe(false)
  })
})
