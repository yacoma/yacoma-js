import { BaseUser } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as BaseUser
const now: number = Date.now()

describe('Contact.type', () => {
  it('should be `Contact`', () => {
    expect(
      validate.contactType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Contact' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.contactType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Item' } as any,
      })
    ).toBe(`type: invalid value 'Item' should be 'Contact' for Contacts.`)
  })
})
