import { Collection, getItem, isPairCollection, Message } from '@lucidogen/data'
import { Document } from '@lucidogen/document'
import { action } from 'overmind'
import { Context, Operator } from '../app'
import { getDraft } from '../effects'

async function shareAttachments(ctx: Context) {
  const { chat } = ctx.effects
  const draft = ctx.state.chat.draft
  if (!draft) {
    return
  }
  const { attachments } = draft
  if (attachments) {
    const target = getItem(ctx, draft.collectionId) as Collection
    await Promise.all(
      Object.keys(attachments).map(key =>
        chat.shareToTarget(ctx, target, attachments[key])
      )
    )
  }
}

async function createMessage(
  ctx: Context,
  preview?: boolean
): Promise<Message> {
  const { data } = ctx.effects
  const { draft } = ctx.state.chat
  const msg = await data.createMessage(
    ctx,
    draft!.collectionId,
    { title: draft!.title, attachments: draft!.attachments },
    preview
  )
  return msg
}

export const send: Operator<{
  collectionId: string
  preview?: boolean
}> = action(async (ctx, selected) => {
  const { data } = ctx.effects
  const { collectionId, preview } = selected
  const item = getItem(ctx, collectionId)
  if (isPairCollection(item!) && item.$unsaved) {
    // create
    await data.createPairCollection(ctx, item.$user!)
  }

  const draft = getDraft(ctx, collectionId)

  if (draft.previewId) {
    if (preview) {
      // just make sure the document is selected
      ctx.actions.data.select({
        id: draft.previewId,
        collectionId: collectionId,
      })
    } else {
      // save and close
      const item = getItem(ctx, draft.previewId, collectionId) as Document

      if (!item.title) {
        // all blank: ignore
        delete ctx.state.msgDb[collectionId][item.id]
        return
      }
      if (item) {
        if (item.composition && Object.keys(item.composition.g).length <= 1) {
          // composition only has a title: remove
          delete item.composition
        }
        // We do not wait for share or save to finish.
        ctx.actions.document.saveWithoutHooks(item)
        ctx.actions.data.select(undefined)
        shareAttachments(ctx)
        delete ctx.state.chat.draft
      }
    }
  } else if (!preview && !draft.title) {
    // ignore
    ctx.actions.chat.clear()
  } else {
    const msg = await createMessage(ctx, preview)
    if (preview) {
      draft.previewId = msg.id
      ctx.actions.data.select({ id: msg.id, collectionId })
    } else {
      shareAttachments(ctx)
      delete ctx.state.chat.draft
    }
  }
  ctx.state.document.view = 'Messages'
  if (ctx.state.document.selectedCollectionId !== collectionId) {
    ctx.actions.data.selectCollection(collectionId)
  }
})
