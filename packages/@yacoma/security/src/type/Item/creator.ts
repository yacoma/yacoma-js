import { Context, Item } from '../../types'

export function creator({ currentUser, oldRecord, newRecord}: Context<Item>): string | void {
  if (!oldRecord) {
    // create
    if (newRecord.creator !== currentUser.id) {
      return `creator: does not match current user`
    }
  } else {
    // update
    if (newRecord.creator !== oldRecord.creator) {
      return `creator: cannot be changed`
    }
  }
}
