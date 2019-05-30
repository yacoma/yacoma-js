import { validateUserAccessEntries } from '../../type/Item/userAccess'
import { Item, RawUserWithKeys } from '../../types'
import { canEditAccess } from './canEditAccess'

export function setUserAccess(
  currentUser: RawUserWithKeys,
  item: Item,
  userAccess: Item['userAccess']
) {
  // New items do not have `userAccess` yet.
  if (item.userAccess && !canEditAccess(currentUser.user, item)) {
    throw new Error(`userAccess: you do not have enough rights to edit access`)
  }

  const newItem = Object.assign({}, item, { userAccess })
  if (
    !canEditAccess(currentUser.user, newItem) &&
    item.type !== 'PairCollection'
  ) {
    throw new Error(`userAccess: you cannot remove your admin access`)
  }

  const err = validateUserAccessEntries(newItem.type, userAccess)
  if (err) {
    throw new Error(err)
  }

  // mutate
  if (!item.original) {
    item.original = Object.assign({}, item)
  }

  item.userAccess = userAccess
  item.accessChangedBy = currentUser.user.id
  // Mark accessChangedAt date as needing to be set when sending to server
  item.accessChangedAt = ''
}
