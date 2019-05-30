import { describe, expect, it, throwMessage } from 'test'
import { Item, itemAccessValue } from '../../types'
import { setUserAccess } from './'

const baseItem = ({
  id: 'itemId',
  userAccess: { userId: { access: 'a' } },
} as any) as Item

describe('setUserAccess', () => {
  it('should update userAccess', () => {
    const item: Partial<Item> = {
      id: 'itemId',
      userAccess: { userId: { access: 'a' } },
    }
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    setUserAccess({ user: { id: 'userId' } } as any, item as any, userAccess)
    expect(item.userAccess).toEqual(userAccess)
  })

  it('should set original', async () => {
    const item = Object.assign({}, baseItem)
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    await setUserAccess({ user: { id: 'userId' } } as any, item, userAccess)
    expect(item.original).toEqual(baseItem)
  })

  it('should not set original if already set', async () => {
    const original = Object.assign({}, baseItem, { foo: 'bar' })
    const item = Object.assign({}, baseItem, { original })
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    await setUserAccess({ user: { id: 'userId' } } as any, item, userAccess)
    expect(item.original).toBe(original)
  })

  it('should reset accessChangedAt', () => {
    const item: Partial<Item> = {
      id: 'itemId',
      accessChangedAt: 'someSignedDate',
      userAccess: { userId: { access: 'a' } },
    }
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    setUserAccess({ user: { id: 'userId' } } as any, item as any, userAccess)
    expect(item.accessChangedAt).toEqual('')
  })

  it('should set accessChangedBy', () => {
    const item: Partial<Item> = {
      id: 'itemId',
      accessChangedBy: 'someOtherId',
      userAccess: { userId: { access: 'a' } },
    }
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    setUserAccess({ user: { id: 'userId' } } as any, item as any, userAccess)
    expect(item.accessChangedBy).toEqual('userId')
  })

  it('should not update accessChangeLog', async () => {
    const item: Partial<Item> = {
      id: 'itemId',
      userAccess: { userId: { access: 'a' } },
      accessChangeLog: [],
    }
    const userAccess = {
      otherId: { access: itemAccessValue.editor },
      userId: { access: 'a' },
    }
    await setUserAccess(
      { user: { id: 'userId' } } as any,
      item as any,
      userAccess
    )
    expect(item.accessChangeLog).toEqual([])
  })

  it('should throw if user is not an admin', async () => {
    expect(
      await throwMessage(() =>
        setUserAccess(
          { user: { id: 'userId' } } as any,
          {
            id: 'itemId',
            userAccess: { userId: { access: itemAccessValue.editor } },
          } as any,
          {}
        )
      )
    ).toMatch(`userAccess: you do not have enough rights to edit access`)
  })

  it('should throw if admin is removing his/her access', async () => {
    expect(
      await throwMessage(() =>
        setUserAccess(
          { user: { id: 'userId' } } as any,
          {
            id: 'itemId',
            userAccess: { userId: { access: 'a' } },
          } as any,
          { userId: { access: itemAccessValue.editor } }
        )
      )
    ).toMatch(`userAccess: you cannot remove your admin access`)
  })

  it('should throw if access is not valid', async () => {
    expect(
      await throwMessage(() =>
        setUserAccess(
          { user: { id: 'userId' } } as any,
          {
            id: 'itemId',
            userAccess: { userId: { access: 'a' } },
          } as any,
          { otherId: { access: 'x' }, userId: { access: 'a' } }
        )
      )
    ).toMatch(`userAccess: invalid access "x" for user "otherId"`)
  })
})
