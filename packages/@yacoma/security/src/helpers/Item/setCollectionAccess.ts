import { Item, RawUserWithKeys } from '../../types'

export function setCollectionAccess(
  currentUser: RawUserWithKeys,
  item: Item,
  collectionAccess: Item['collectionAccess']
) {
  // FIXME: empty collectionAccess ==> add private...

  // mutate
  if (!item.original) {
    item.original = Object.assign({}, item)
  }

  item.collectionAccess = collectionAccess
  item.accessChangedBy = currentUser.id
  // Mark accessChangedAt date as needing to be set when sending to server
  item.accessChangedAt = ''
}
