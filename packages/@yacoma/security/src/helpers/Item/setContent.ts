import * as crypt from '@lucidogen/crypt'
import { Item, UserWithKeys } from '../../types'
import { getItemKey } from '../keys'
import { canEditContent } from './canEditContent'

export async function setContent(
  currentUser: UserWithKeys,
  item: Item,
  value: any
) {
  const encryption = await getItemKey(currentUser, item)

  if(item.content) {
    const decryptedContent = await crypt.decrypt<typeof item.content>(
      item.editor,
      encryption.encryptionKey,
      item.content
    )
    if (JSON.stringify(decryptedContent.payload) === JSON.stringify(value)) {
      // Nothing changed
      return
    }
  }

  if (!canEditContent(currentUser.user, item)) {
    throw new Error('You do not have enough rights to edit content.')
  }

  if (!item.original) {
    // mutate
    item.original = Object.assign({}, item)
  }

  item.editedAt = ''
  item.editor = currentUser.id
  item.content = await crypt.encrypt(
    currentUser.signKey,
    encryption.encryptionKey,
    value
  )
}
