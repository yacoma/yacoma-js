import { Base, Item } from '../../types'

export function isAdmin(currentUser: Base, item: Item): boolean {
  if (!item.userAccess) {
    throw new Error('"userAccess" field is not set.')
  }
  const userAccess = item.userAccess[currentUser.id]
  return (userAccess && userAccess.access.includes('a')) || false
}
