import {
  extractUserId,
  isCollectionId,
  isPairCollectionId,
  isWorkCollectionId,
  otherUserIdFromPairCollection,
  privateCollectionId,
  workCollectionId,
} from '@lucidogen/security'
import { MiniContext } from '../app'
import { getItem } from './getItem'

export function limitText(text: string, limit: number) {
  if (limit && text.length > limit) {
    const words = text.split(' ')
    if (words.length && words[0].length <= limit - 1) {
      return (
        words
          .slice(1)
          .reduce(
            (acc, w) =>
              acc.length + w.length + 1 <= limit - 1 ? `${acc} ${w}` : acc,
            words[0]
          ) + '…'
      )
    } else {
      return text.length > limit ? text.slice(0, limit - 1) + '…' : text
    }
  } else {
    return text
  }
}

export function collectionTitle({ state }: MiniContext, id: string) {
  const uid = state.data.auth.id
  const translate = state.locale.translate
  if (id === privateCollectionId(uid)) {
    // Private
    return translate('PrivateCollection')
  } else if (id === workCollectionId(uid)) {
    // Me
    return translate('MyCollection')
  } else if (isWorkCollectionId(id)) {
    // Other person
    const otherUserId = extractUserId(id)
    return (state.db.User[otherUserId] || { username: otherUserId.slice(0, 8) })
      .username
  } else if (isPairCollectionId(id)) {
    // PairCollection
    const coll = state.db.PairCollection[id]
    const otherUserId = otherUserIdFromPairCollection(uid, coll.raw)
    if (otherUserId === uid) {
      // translate('Me') <== this can be confusing
      return state.db.User[uid].username
    }
    return (state.db.User[otherUserId] || { username: otherUserId.slice(0, 8) })
      .username
  } else {
    const theItem = getItem({ state }, id)
    return (theItem && theItem.title) || state.locale.translate('NewCollection')
  }
}

export function itemTitle(
  ctx: MiniContext,
  selected: { id: string; title?: string },
  limit?: number
) {
  if (!selected) {
    return ''
  }
  const { id, title } = selected
  if (isCollectionId(id)) {
    return collectionTitle(ctx, id)
  }
  const theItem = title ? selected : getItem(ctx, id)
  const t =
    (theItem && theItem.title) || ctx.state.locale.translate('NewDocument')
  return limit ? limitText(t, limit) : t
}
