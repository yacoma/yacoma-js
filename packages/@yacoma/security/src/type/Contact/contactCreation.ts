import { Context, Item } from '../../types'

export function contactCreation({
  currentUser,
  oldRecord,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // New
    if (!currentUser.admin) {
      return `Contact: only admin users can create contacts`
    }
  }
}
