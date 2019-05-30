import { Base, Item } from '../../types'

export function isEditor(currentUser: Base, item: Item): boolean {
  if (!item.userAccess) {
    throw new Error('"userAccess" field is not set.')
  }
  const userAccess = item.userAccess[currentUser.id]
  const access = (userAccess && userAccess.access) || ''
  return access.includes('e')
}
