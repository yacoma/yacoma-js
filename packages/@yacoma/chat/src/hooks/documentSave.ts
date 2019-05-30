import { isMessage, Item } from '@yacoma/data'
import { Context } from '../app'

export async function documentSave(ctx: Context, item: Item) {
  if (isMessage(item)) {
    const collectionId = Object.keys(item.raw.collectionAccess)[0]
    const draft = ctx.state.chat.draft
    if (draft && draft.previewId === item.id) {
      // Use 'send' instead of save
      await ctx.actions.chat.send({ collectionId })
      return true
    }
  }
  return false
}
