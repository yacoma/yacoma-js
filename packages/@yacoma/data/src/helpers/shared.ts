import {
  isCollection,
  isPairCollectionId,
  isPrivateCollectionId,
} from '@lucidogen/security'
import { Context } from '../app'
import { Item } from '../dataTypes'
import { getItem } from './getItem'

export function isShared(
  ctx: { state: Context['state'] },
  item: Item
): boolean {
  if (isPairCollectionId(item.id)) {
    // one-to-one is considered "private" = not shared with many others
    return false
  } else if (isCollection(item)) {
    // Seen by others
    return Object.keys(item.raw.userAccess).length > 1
  } else {
    // At least one of the collections is shared with many
    // people
    return (
      Object.keys(item.raw.collectionAccess).findIndex(collId => {
        if (isPairCollectionId(collId) && isPrivateCollectionId(collId)) {
          return false
        }
        const collection = getItem(ctx, collId)
        if (collection) {
          return isShared(ctx, collection)
        } else {
          // Unknown collection === seen by others.
          return true
        }
      }) >= 0
    )
  }
}
