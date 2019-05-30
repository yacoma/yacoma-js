import * as helpers from '../../helpers'
import { Context, Item } from '../../types'

export function collectionAccess({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // Create
  } else if (
    JSON.stringify(oldRecord.collectionAccess) !==
    JSON.stringify(newRecord.collectionAccess)
  ) {
    // Update
    if (!helpers.canEditAccess(currentUser, oldRecord)) {
      return 'collectionAccess: should only be changed by an admin'
    }
  }
}
