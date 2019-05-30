import * as crypt from '@yacoma/crypt'
import { Context, Item } from '../../types'

export async function content({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): Promise<string | void> {
  if (!oldRecord) {
    // new
    try {
      crypt.verify<crypt.EncryptedPayload>(currentUser.id, newRecord.content)
    } catch (e) {
      return `content: should be signed by current user (content changed)`
    }
  } else if (oldRecord.content !== newRecord.content) {
    // changed
    try {
      crypt.verify<crypt.EncryptedPayload>(currentUser.id, newRecord.content)
    } catch (e) {
      return `content: should be signed by current user (new content)`
    }
  } else {
    // no change
  }
}
