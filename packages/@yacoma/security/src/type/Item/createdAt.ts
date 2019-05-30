import { timeSkewCheck } from '../../helpers'
import { Context, Item } from '../../types'

export async function createdAt({
  now,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // new
    const createdAt = Date.parse(newRecord.createdAt)
    const dateError = timeSkewCheck(now, 'createdAt', createdAt)
    if (dateError) {
      return dateError
    }
  } else {
    if (oldRecord.createdAt !== newRecord.createdAt) {
      return `createdAt: should not change`
    }
  }
}
