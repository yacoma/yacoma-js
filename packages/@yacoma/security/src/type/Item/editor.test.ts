import { describe, expect, it } from 'test'

import { Base, Item } from '../../types'
import * as validate from './'

const now: number = Date.now()

/*
This field must contain the id of the current user when content is edited
(**content** field). Same as creator on new items.
*/
describe('Item.editor', () => {
  it('should be current user on new item', async () => {
    const currentUser = {
      id: 'oneId',
    } as Base
    const args1 = {
      editor: 'oneId',
    } as Item
    const args2 = {
      editor: 'twoId',
    } as Item

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: args1,
      })
    ).toBe(undefined)

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord: undefined,
        newRecord: args2,
      })
    ).toBe(`editor: should be current user (new content)`)
  })

  it('should not change if content does not change', async () => {
    const currentUser = {
      id: 'oneId',
    } as Base
    const oldRecord = {
      content: 'foo',
      editor: 'oneId',
    } as Item
    const newRecord = {
      content: 'foo',
      editor: 'twoId',
    } as Item

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord,
        newRecord: oldRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord,
        newRecord,
      })
    ).toBe(`editor: should not change (same content)`)
  })

  it('should be current user if content changed', async () => {
    const currentUser = {
      id: 'twoId',
    } as Base
    const oldRecord = {
      content: 'foo',
      editor: 'oneId',
    } as Item
    const args1 = {
      content: 'bar',
      editor: 'twoId',
    } as Item
    const args2 = {
      content: 'bar',
      editor: 'oneId',
    } as Item

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord,
        newRecord: args1,
      })
    ).toBe(undefined)

    expect(
      await validate.editor({
        now,
        currentUser,
        oldRecord,
        newRecord: args2,
      })
    ).toBe(`editor: should be current user (changed content)`)
  })
})
