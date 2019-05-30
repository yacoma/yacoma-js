import { ItemTypesWithoutMessage, workCollectionId } from '@lucidogen/security'
import { MiniContext } from '../app'
import { Collection, Item } from '../dataTypes'
import {
  filterByCollection,
  filterByCollectionAndTitle,
  filterByTitle,
} from './filter'
import {
  sortByDate,
  sortByDateAndOwn,
  sortByTitle,
  sortByTitleAndOwn,
} from './sort'

export function itemList(
  ctx: MiniContext,
  filter?: { collectionId?: string; title?: string },
  sort?: 'title' | 'date',
  types: ItemTypesWithoutMessage[] = [
    'PrivateCollection',
    'WorkCollection',
    'Collection',
    'Item',
  ]
): Item[] {
  const { state } = ctx
  const uid = state.data.auth.id
  const ownIds: { [key: string]: string } = {
    WorkCollection: workCollectionId(uid),
  }

  const groups = types.map(type => {
    const all = state.db[type]
    let list = Object.keys(all).map(id => all[id])
    if (filter) {
      const { collectionId, title } = filter
      if (collectionId && title) {
        list = list.filter(filterByCollectionAndTitle(ctx, collectionId, title))
      } else if (title) {
        list = list.filter(filterByTitle(ctx, title))
      } else if (collectionId) {
        list = list.filter(filterByCollection(state, collectionId))
      }
    }
    if (sort === 'date') {
      list.sort(ownIds[type] ? sortByDateAndOwn(ownIds[type]) : sortByDate)
    } else {
      list.sort(ownIds[type] ? sortByTitleAndOwn(ownIds[type]) : sortByTitle)
    }
    return list
  })
  return ([] as Item[]).concat(...groups)
}

export function collectionList(
  ctx: MiniContext,
  filter?: { collectionId?: string; title?: string },
  sort?: 'title' | 'date',
  types: ItemTypesWithoutMessage[] = [
    'PrivateCollection',
    'WorkCollection',
    'Collection',
    'PairCollection',
  ]
): Collection[] {
  return itemList(ctx, filter, sort, types) as Collection[]
}
