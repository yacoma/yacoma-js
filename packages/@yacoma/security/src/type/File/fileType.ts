import { Context, Item } from '../../types'

export function fileType({
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  //
  if (!oldRecord) {
    // New
    if (newRecord.type !== 'File') {
      return `type: invalid value '${
        newRecord.type
      }' should be 'File' for Files`
    }
  } else if (newRecord.type !== oldRecord.type) {
    // Update
    return `type: cannot be changed`
  }
}
