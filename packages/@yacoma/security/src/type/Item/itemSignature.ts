import * as security from '../..'
import { Context, Item } from '../../types'

export async function itemSignature({
  newRecord,
}: Context<Item>): Promise<string | void> {
  try {
    await security.verifySignature(newRecord, newRecord.signature)
  } catch (e) {
    return `signature: invalid signature`
  }
}
