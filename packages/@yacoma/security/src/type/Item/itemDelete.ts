import * as helpers from '../../helpers'
import { Context, Item } from '../../types'

export function itemDelete({ currentUser, oldRecord, newRecord}: Context<Item>): string | void {
  if (!oldRecord) {
    // New
    if (newRecord.deleted !== undefined && newRecord.deleted !== false) {
      return `deleted: cannot be set for new items`
    }
  } else {
    // Update
    if (oldRecord.deleted !== newRecord.deleted && !helpers.canDelete(currentUser, oldRecord)) {
      return 'deleted: should only be changed by an admin'
    }
    if (
      newRecord.deleted !== true &&
      newRecord.deleted !== false &&
      newRecord.deleted !== undefined
    ) {
      return `deleted: invalid value (should be true, false or undefined)`
    }
  }
}
