import { isContactId } from '@lucidogen/security'
import { action } from 'overmind'
import { Operator } from '../app'
import { isPairCollection } from '@lucidogen/data'

export const shareItem: Operator<{
  id: string
  targetId: string
}> = action(async (ctx, value) => {
  const { chat, data } = ctx.effects
  const { targetId } = value
  if (isContactId(targetId)) {
    return chat.addAttachment(ctx, value)
  }

  const collection = data.getItem(ctx, targetId)
  if (!collection) {
    throw new Error(`Invalid drag data: ${value}`)
  }
  if (isPairCollection(collection) && collection.$unsaved) {
    // create
    await data.createPairCollection(ctx, collection.$user!)
  }

  if (data.isShared(ctx, collection)) {
    // shared
    chat.addAttachment(ctx, value)
  } else {
    // private
    chat.share(ctx, value)
  }
})
