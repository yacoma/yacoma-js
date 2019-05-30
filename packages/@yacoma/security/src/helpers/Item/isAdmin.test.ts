import { itemAccessValue } from '../../types'
import { isAdmin } from './'

describe('Item.isAdmin', () => {
  it('should return true if user has admin access', () => {
    const item = {
      userAccess: {
        someId: {
          access: 'a',
        },
      },
    }
    expect(isAdmin({ id: 'someId' } as any, item as any)).toBe(true)
  })

  it('should return false if user does not have admin access', () => {
    const item = {
      userAccess: {
        someId: {
          access: itemAccessValue.editor,
        },
      },
    }
    expect(isAdmin({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should return false if user is not in userAccess', () => {
    const item = {
      userAccess: {
        otherId: {
          access: itemAccessValue.admin,
        },
      },
    }
    expect(isAdmin({ id: 'someId' } as any, item as any)).toBe(false)
  })

  it('should throw when userAccess field is not set', () => {
    const item = {}
    expect(() => isAdmin({ id: 'someId' } as any, item as any)).toThrow(
      '"userAccess" field is not set.'
    )
  })
})
