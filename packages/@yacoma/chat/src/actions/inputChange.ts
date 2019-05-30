import { action } from 'overmind'
import { getItem } from '@yacoma/data'
import { Operator } from '../app'
import { getDraft } from '../effects'

export const inputChange: Operator<{
  collectionId: string
  value: string
}> = action((ctx, arg) => {
  const { collectionId, value } = arg
  const draft = getDraft(ctx, collectionId)

  if (draft.previewId) {
    const form = getItem(ctx, draft.previewId)
    if (!form) {
      return
    }
    ctx.actions.editor.titleChange({
      holder: form,
      value,
    })
  } else {
    draft.title = value
  }
})
