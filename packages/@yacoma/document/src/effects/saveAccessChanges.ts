import { Context } from '../app'

export async function saveAccessChanges(ctx: Context) {
  const { data, document } = ctx.effects
  const { current, form } = ctx.state.document
  if (current) {
    await data.saveAccessChanges(ctx, current, form)
  }
  document.clearForm(ctx)
}
