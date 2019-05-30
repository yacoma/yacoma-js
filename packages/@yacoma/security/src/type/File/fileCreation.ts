import { Context, Item } from '../../types'

export function fileCreation({
  oldRecord,
  file,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // New
    if (!file) {
      return `File: cannot create without a file`
    }
  }
}
