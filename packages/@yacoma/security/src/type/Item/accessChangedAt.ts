import { timeSkewCheck } from '../../helpers'
import { Context, Item } from '../../types'

const accessKeys: (keyof Item)[] = ['userAccess', 'collectionAccess', 'deleted']

export async function accessChangedAt({
  now,
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // new
    if (newRecord.accessChangedAt !== newRecord.createdAt) {
      return `accessChangedAt: should equal createdAt (new item)`
    }
  } else {
    const changes = accessKeys.filter(
      key => JSON.stringify(newRecord[key]) !== JSON.stringify(oldRecord[key])
    )
    if (changes.length) {
      // changed
      if (newRecord.accessChangedAt === oldRecord.accessChangedAt) {
        return `accessChangedAt: should update (${changes.join(' ')} changed)`
      }
      let accessChangedAt = Date.parse(newRecord.accessChangedAt)
      const dateError = timeSkewCheck(now, 'accessChangedAt', accessChangedAt)
      if (dateError) {
        return dateError
      }
    } else {
      // same access
      if (newRecord.accessChangedAt !== oldRecord.accessChangedAt) {
        return `accessChangedAt: should not change (same access)`
      }
    }
  }
}
