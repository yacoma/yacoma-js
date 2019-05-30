import { Operator } from '../app'
import { action } from 'overmind'

export const cancelContact: Operator = action(ctx => {
  const { data, dialog } = ctx.effects
  data.clearForm(ctx)
  dialog.hide(ctx)
})

export const newContact: Operator = action(ctx => {
  const { data, dialog } = ctx.effects
  data.clearForm(ctx)
  data.newWordList(ctx)
  dialog.show(ctx, 'ContactCreate')
})

export const createContact: Operator = action(async ctx => {
  const { data, dialog } = ctx.effects
  const result = await data.createContact(ctx)
  if (!result) {
    console.log('COULD NOT CREATE CONTACT ??')
  } else {
    dialog.show(ctx, 'ContactPrint')
  }
})
