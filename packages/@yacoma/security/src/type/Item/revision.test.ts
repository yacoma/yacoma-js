import { Base } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base
const now: number = Date.now()
const revision = 123

/*
This field must contain `1` for new items and old revision `+1` for exiting items.
*/
describe('Item.revision', () => {
  it('should be 1 for new items', () => {
    expect(
      validate.revision({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { revision: 1 } as any,
      })
    ).toBe(undefined)

    expect(
      validate.revision({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { revision: 2 } as any,
      })
    ).toBe(`revision: should be 1 for new items`)
  })

  it('should increase by one compared to old item', () => {
    expect(
      validate.revision({
        now,
        currentUser,
        oldRecord: { revision, editedAt: 'xx' } as any,
        newRecord: { revision: revision + 1, editedAt: 'yy' } as any,
      })
    ).toBe(undefined)

    expect(
      validate.revision({
        now,
        currentUser,
        oldRecord: { revision, editedAt: 'xx' } as any,
        newRecord: { revision, editedAt: 'yy' } as any,
      })
    ).toBe(`revision: conflict detected (needs to resolve with revision 123)`)
  })

  it('should not change if nothing changed', () => {
    // Yes ?
    expect(
      validate.revision({
        now,
        currentUser,
        oldRecord: { revision } as any,
        newRecord: { revision: revision + 1 } as any,
      })
    ).toBe(`revision: cannot change without access or content change`)
  })
})
