import { Item, RawUserWithKeys } from '../../types'
import { canDelete } from './canDelete'

export async function setDeleted(
  currentUser: RawUserWithKeys,
  item: Item,
  value: any
) {
  if (!canDelete(currentUser.user, item)) {
    throw new Error(`You do not have enough rights to delete.`)
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Invalid value for 'deleted' (should be true or false).`)
  }

  // mutate
  if (!item.original) {
    item.original = Object.assign({}, item)
  }

  item.deleted = value
  item.accessChangedAt = ''
  item.accessChangedBy = currentUser.id
}
