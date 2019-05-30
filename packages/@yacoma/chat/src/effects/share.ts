import { Collection } from '@lucidogen/data'
import { isCollectionId } from '@lucidogen/security'
import { Context } from '../app'

export async function share(
  ctx: Context,
  value: {
    id: string
    targetId: string
  }
) {
  const { data } = ctx.effects
  const { id, targetId } = value
  const target = data.getItem(ctx, targetId) as Collection
  if (!target) {
    throw new Error(`Cannot share to id '${targetId}' (target not found).`)
  }
  // Whe don't have to check for PairCollection here because we cannot
  // do a direct share to something that is not private.
  await shareToTarget(ctx, target, { id })
  ctx.actions.data.selectCollection(targetId)
}

// This should probably be refactored and moved to data.
export async function shareToTarget(
  ctx: Context,
  target: Collection,
  attachment: { id?: string }
) {
  const { db } = ctx.state
  const { data } = ctx.effects
  const { id } = attachment
  if (!id) {
    return
  }

  if (isCollectionId(id)) {
    const sharedCollection = db.Collection[id]
    const theSharedCollection = Object.assign({}, sharedCollection, {
      raw: Object.assign({}, sharedCollection.raw),
    })
    // Share a collection to some users:
    const targetUsers = Object.keys(target.raw.userAccess).map(
      userId => db.User[userId]
    )
    await data.inviteUsersToCollection(ctx, theSharedCollection, targetUsers)
    // collection = updated collection (needs to be saved)
    // For now: no need to update the attachment as the users are now invited.
    /* If we want to let users choose to accept invites, we need them to update
     * the shared collection with the `key` instead of `invite`. This should
     * be fixed by allowing changes to only this field. Not sure how to do this
     * since everything is now in `signature`... Same goes for accessChangeLog.
     */
  } else {
    const sharedItem = db.Item[id]

    const theSharedItem = Object.assign({}, sharedItem, {
      raw: Object.assign({}, sharedItem.raw),
    })
    // We must share the item in the target collection:
    await data.shareItemToCollection(ctx, theSharedItem, target.id)
    // No need to update the attachment: item is now shared.
  }
}
