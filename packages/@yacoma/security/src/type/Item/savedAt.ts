import { Context, Item } from '../../types'

export async function savedAt({ now, newRecord }: Context<Item>): Promise<string | void> {
  if (Date.parse(newRecord.savedAt) !== now) {
    return `savedAt: is not equal to context.now`
  }
}
