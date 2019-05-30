import { Base } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base
const now: number = Date.now()

describe('File creation', () => {
  it('should contain context file', () => {
    expect(
      validate.fileCreation({
        now,
        currentUser,
        file: new Uint8Array([1, 2, 3]),
        oldRecord: undefined,
        newRecord: { type: 'File' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.fileCreation({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'File' } as any,
      })
    ).toBe(`File: cannot create without a file`)
  })
})
