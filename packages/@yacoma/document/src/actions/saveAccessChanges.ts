import { action } from 'overmind'
import { Operator } from '../app'

export const saveAccessChanges: Operator = action(ctx => {
  const { document, dialog } = ctx.effects

  document.saveAccessChanges(ctx)
  document.clearForm(ctx)
  dialog.hide(ctx)
})
