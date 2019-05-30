import { Base, Item, itemAccessValue, UserAccess } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base
const now: number = Date.now()
const userAccess: UserAccess = {
  userId: {
    access: itemAccessValue.admin,
  },
}
const userAccess2: UserAccess = {
  otherId: {
    access: itemAccessValue.admin,
  },
}
/*
FIXME: item delete rules
*/
describe('Item.deleted', () => {
  it('should accept true, false or undefined values', () => {
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: { userAccess } as any,
        newRecord: { deleted: true } as Item,
      })
    ).toBe(undefined)
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: { userAccess } as any,
        newRecord: { deleted: false } as Item,
      })
    ).toBe(undefined)
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: { userAccess } as any,
        newRecord: {} as Item,
      })
    ).toBe(undefined)
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: { userAccess } as any,
        newRecord: { deleted: 'deleted' } as any,
      })
    ).toBe(`deleted: invalid value (should be true, false or undefined)`)
  })

  it('should not be set for new items', () => {
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { deleted: true } as Item,
      })
    ).toBe(`deleted: cannot be set for new items`)
  })

  it('should only be changed by admins', () => {
    expect(
      validate.itemDelete({
        now,
        currentUser,
        oldRecord: { userAccess: userAccess2 } as any,
        newRecord: { deleted: true } as Item,
      })
    ).toBe(`deleted: should only be changed by an admin`)
  })
})
