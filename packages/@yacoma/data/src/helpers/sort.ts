import { Item } from '../dataTypes'

export interface SortItem {
  (a: Item, b: Item): number
}

export const sortByTitle: SortItem = (a, b) =>
  a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1

export const sortByDate: SortItem = (a, b) =>
  !a.raw.editedAt
    ? -1
    : !b.raw.editedAt
    ? 1
    : a.raw.editedAt > b.raw.editedAt
    ? -1
    : 1

export function sortByTitleAndOwn(id: string): SortItem {
  return (a, b) => (a.id === id ? -1 : b.id === id ? 1 : sortByTitle(a, b))
}

export function sortByDateAndOwn(id: string): SortItem {
  return (a, b) => (a.id === id ? -1 : b.id === id ? 1 : sortByDate(a, b))
}
