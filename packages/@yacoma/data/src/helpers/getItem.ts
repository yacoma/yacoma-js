import { typeFromId } from '@yacoma/security'
import { MiniContext } from '../app'
import { Item } from '../dataTypes'

export function getItem<T extends Item = Item>(
  { state }: MiniContext,
  id: string,
  collId?: string
): T | undefined {
  const type = typeFromId(id)
  if (type === 'Message') {
    if (!collId) {
      throw new Error(`Missing collection id: cannot get message.`)
    }
    if (!state.msgDb[collId]) {
      return undefined
    }
    return state.msgDb[collId][id] as T
  } else if (type === 'Contact') {
    // Contact are listed as regular items if they can be edited
    // otherwise, we get them from db.Contact
    return (state.db.Item[id] || state.db.Contact[id]) as T
  } else if (type === 'File') {
    // File items are listed as regular items.
    return state.db.Item[id] as T
  } else {
    return state.db[type][id] as T
  }
}
