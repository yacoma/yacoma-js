import { isCollectionId } from '@lucidogen/security'
import { Operator } from '../app'
import { Item } from '../dataTypes'
import { action } from 'overmind'

export const itemChanged: Operator<Item> = action(async (ctx, value) => {
  const { data } = ctx.effects
  // Must store the item from this action (it is not stored in subscription).
  data.storeItem(ctx, value)

  if (isCollectionId(value.id)) {
    const collection = data.getItem(ctx, value.id)
    if (collection) {
      // Exists: nothing special
    } else {
      // New collection, query for items (and store them).
      await data.query<Item>(ctx, 'Item', {
        collectionId: value.id,
      })
    }
  }
})
