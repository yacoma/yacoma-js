import { MiniContext } from '../app'
import { Item } from '../dataTypes'
import { itemTitle } from './title'

export interface ItemFilter {
  (item: Item): boolean
}

export function filterByTitle(ctx: MiniContext, search: string): ItemFilter {
  const lsearch = search.toLocaleLowerCase()
  return function(item: Item) {
    return itemTitle(ctx, item)
      .toLocaleLowerCase()
      .includes(lsearch)
  }
}

export function filterByUsername(search: string) {
  const lsearch = search.toLocaleLowerCase()
  return function(user: { username: string }) {
    return user.username.toLocaleLowerCase().includes(lsearch)
  }
}

export function filterByCollectionAndTitle(
  ctx: MiniContext,
  collId: string,
  title: string
): ItemFilter {
  const ltitle = title.toLocaleLowerCase()
  return function(item: Item) {
    return (
      item.raw.collectionAccess[collId] &&
      itemTitle(ctx, item)
        .toLocaleLowerCase()
        .includes(ltitle)
    )
  }
}

export function filterByCollection(_: {}, collId: string): ItemFilter {
  return function(item: Item) {
    return !!item.raw.collectionAccess[collId]
  }
}
