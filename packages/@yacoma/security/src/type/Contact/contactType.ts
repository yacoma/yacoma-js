import { Context, Item } from '../../types'

export function contactType({
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  //
  if (!oldRecord) {
    // New
    if (newRecord.type !== 'Contact') {
      return `type: invalid value '${
        newRecord.type
      }' should be 'Contact' for Contacts.`
    }
  } else if (newRecord.type !== oldRecord.type) {
    // Update
    return `type: cannot be changed`
  }
}
