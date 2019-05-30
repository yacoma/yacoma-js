import { Context, Item } from '../../types'

export async function editor({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // create
    if (newRecord.editor !== currentUser.id) {
      return `editor: should be current user (new content)`
    }
  } else {
    // update
    if (oldRecord.content !== newRecord.content) {
      // changed
      if (newRecord.editor !== currentUser.id) {
        return `editor: should be current user (changed content)`
      }
    } else {
      // not changed
      if (newRecord.editor !== oldRecord.editor) {
        return `editor: should not change (same content)`
      }
    }
  }
}
