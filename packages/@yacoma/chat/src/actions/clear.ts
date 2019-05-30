import { action } from 'overmind'
import { Operator } from '../app'

export const clear: Operator<void> = action(ctx => {
  const { draft } = ctx.state.chat
  if (draft) {
    if (draft.previewId) {
      if (
        ctx.state.document.selected &&
        ctx.state.document.selected.id === draft.previewId
      ) {
        ctx.actions.data.select(undefined)
      }
      delete ctx.state.msgDb[draft.collectionId][draft.previewId]
    }
    delete ctx.state.chat.draft
  }
})
