import { Context, Item } from '../../types'

const accessKeys: (keyof Item)[] = ['userAccess', 'collectionAccess', 'deleted']

export async function accessChangedBy({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // create
    if (newRecord.accessChangedBy !== currentUser.id) {
      return `accessChangedBy: should be current user (new item)`
    }
  } else {
    // update
    const changes = accessKeys.filter(
      key => JSON.stringify(newRecord[key]) !== JSON.stringify(oldRecord[key])
    )
    if (changes.length) {
      // changed
      if (newRecord.accessChangedBy !== currentUser.id) {
        return `accessChangedBy: should be current user (${changes.join(
          ' '
        )} changed)`
      }
    } else {
      // not changed
      if (newRecord.accessChangedBy !== oldRecord.accessChangedBy) {
        return `accessChangedBy: should not change (same access)`
      }
    }
  }
}
