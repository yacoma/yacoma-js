import { Context, Item } from '../../types'

export function messageType({
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  //
  if (!oldRecord) {
    // New
    if (newRecord.type !== 'Message') {
      return `type: invalid value '${
        newRecord.type
      }' should be 'Message' for Messages.`
    }
  } else if (newRecord.type !== oldRecord.type) {
    // Update
    return `type: cannot be changed`
  }
}
