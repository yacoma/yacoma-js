import { Base, Item } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base

/*
This field must contain the current time (on any mutate operation).
*/
describe('Item.savedAt', () => {
  it('should ensure savedAt is now', async () => {
    const now = Date.now()
    expect(
      await validate.savedAt({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { savedAt: new Date(now).toISOString() } as Item,
      })
    ).toBe(undefined)

    expect(
      await validate.savedAt({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { savedAt: new Date(now + 1).toISOString() } as Item,
      })
    ).toBe(`savedAt: is not equal to context.now`)
  })
})
