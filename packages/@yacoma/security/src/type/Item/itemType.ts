import { Context, Item, ITEM_TYPES } from '../../types'

export function itemType({
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // New
    if (!ITEM_TYPES.includes(newRecord.type)) {
      return `type: invalid value '${
        newRecord.type
      }' should be one of '${ITEM_TYPES.join("', '")}'`
    }
  } else if (newRecord.type !== oldRecord.type) {
    // Update
    return `type: cannot be changed`
  }
}
