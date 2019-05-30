import { describe, expect, it } from 'test'
import { Base, ITEM_TYPES } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as Base
const now: number = Date.now()

/*
Must contain one of 'Item', 'Collection', 'PairCollection' or 'Message'.
Different rules apply to these Items. 'Message' and 'Collection' are derived
types from 'Item'. 'PairCollection' is derived from 'Collection'. This
field cannot be changed after creation.
*/
describe('Item.type', () => {
  it('should pass with valid types', () => {
    expect(
      ITEM_TYPES.map(type =>
        validate.itemType({
          now,
          currentUser,
          oldRecord: undefined,
          newRecord: { type } as any,
        })
      ).filter(res => res !== undefined).length
    ).toBe(0)
    expect(
      validate.itemType({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: { type: 'Foo' } as any,
      })
    ).toBe(
      `type: invalid value 'Foo' should be one of '${ITEM_TYPES.join("', '")}'`
    )
  })

  it('should not change', () => {
    expect(
      validate.itemType({
        now,
        currentUser,
        oldRecord: { type: 'Item' } as any,
        newRecord: { type: 'Collection' } as any,
      })
    ).toBe(`type: cannot be changed`)
  })
})
