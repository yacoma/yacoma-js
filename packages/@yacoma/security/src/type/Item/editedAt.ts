import { timeSkewCheck } from '../../helpers'
import { Context, Item } from '../../types'

export async function editedAt({
  now,
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // new
    if (newRecord.editedAt !== newRecord.createdAt) {
      return `editedAt: should equal createdAt (new content)`
    }
  } else if (newRecord.content !== oldRecord.content) {
    // changed
    if (newRecord.editedAt === oldRecord.editedAt) {
      return `editedAt: should update (changed content)`
    }
    let editedAt = Date.parse(newRecord.editedAt)
    const dateError = timeSkewCheck(now, 'editedAt', editedAt)
    if (dateError) {
      return dateError
    }
  } else {
    // same content
    if (newRecord.editedAt !== oldRecord.editedAt) {
      return `editedAt: should not change (same content)`
    }
  }
}
