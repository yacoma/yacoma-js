import { Context, Item } from '../../types'

export function revision({
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // New
    if (newRecord.revision !== 1) {
      return `revision: should be 1 for new items`
    }
  } else {
    // Update
    if (
      (newRecord.editedAt !== oldRecord.editedAt ||
        newRecord.accessChangedAt !== oldRecord.accessChangedAt) &&
      newRecord.revision !== oldRecord.revision + 1
    ) {
      return `revision: conflict detected (needs to resolve with revision ${
        oldRecord.revision
      })`
    }
    if (
      newRecord.editedAt === oldRecord.editedAt &&
      newRecord.accessChangedAt === oldRecord.accessChangedAt &&
      newRecord.revision !== oldRecord.revision
    ) {
      return `revision: cannot change without access or content change`
    }
  }
}
