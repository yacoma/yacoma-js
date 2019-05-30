import { action } from 'overmind'
import { Item } from '@yacoma/data'
import { Context, Operator } from '../app'
import { Document } from '../types'

async function doSave(ctx: Context, value: Item) {
  const { data } = ctx.effects
  const item = value as Document
  await data.saveItem(ctx, item)
}

export const save: Operator<Item> = action(async (ctx, value) => {
  const { hooks } = ctx.effects
  hooks.run('document_save', ctx, value, async () => {
    await doSave(ctx, value)
  })
})

export const saveWithoutHooks: Operator<Item> = action(doSave)
