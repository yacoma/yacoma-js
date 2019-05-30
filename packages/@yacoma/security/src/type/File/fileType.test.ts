import { describe, expect, it } from 'test'
import { BaseUser } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as BaseUser
const now: number = Date.now()

describe('File.type', () => {
  it('should be `File`', () => {
    expect(
      validate.fileType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'File' } as any,
      })
    ).toBe(undefined)
    expect(
      validate.fileType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Item' } as any,
      })
    ).toBe(`type: invalid value 'Item' should be 'File' for Files`)
  })
})
