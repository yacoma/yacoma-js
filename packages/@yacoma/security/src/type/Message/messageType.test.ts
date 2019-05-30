import { Base } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base
const now: number = Date.now()

describe('Message.type', () => {
  it('should be `Message`', () => {
    expect(
      validate.messageType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Message' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.messageType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Item' } as any,
      })
    ).toBe(`type: invalid value 'Item' should be 'Message' for Messages.`)
  })
})
