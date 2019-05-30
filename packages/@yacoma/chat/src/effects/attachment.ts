import { getItem, Message } from '@lucidogen/data'
import { Context } from '../app'
import { getDraft } from './draft'

export function addAttachment(
  ctx: Context,
  value: {
    id: string
    targetId: string
  }
) {
  const { actions } = ctx
  const { id, targetId: collectionId } = value
  if (
    ctx.state.chat.draft &&
    ctx.state.chat.draft.collectionId !== collectionId
  ) {
    // This should be prevented in UI
    console.log(
      'FIXME: prevent adding attachment in other collection when message is in progress.'
    )
    return
  }
  const inProgress =
    ctx.state.chat.draft &&
    (ctx.state.chat.draft.collectionId !==
      ctx.state.document.selectedCollectionId ||
      ctx.state.document.view !== 'Messages')

  const draft = getDraft(ctx, collectionId)
  draft.attachments[id] = { id }

  if (!inProgress) {
    actions.data.selectCollection(value.targetId)
    ctx.state.document.view = 'Messages'
  }
}

export function removeAttachment({ state }: Context, attachId: string) {
  const draft = state.chat.draft
  if (draft) {
    delete draft.attachments[attachId]
    if (draft.previewId) {
      const item = getItem(
        { state },
        draft.previewId,
        draft.collectionId
      ) as Message
      if (item && item.attachments) {
        delete item.attachments[attachId]
      }
    }
  }
}
