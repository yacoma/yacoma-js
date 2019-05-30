import { Derive } from './app'
import { Item } from './dataTypes'
import { getItem } from './helpers'
import { DataConfig } from './types'

export const current: Derive<
  DataConfig['state']['document'],
  Item | undefined
> = (parent, state) => {
  const selected = parent.selected
  if (!selected) {
    return undefined
  }
  const item = getItem({ state }, selected.id, selected.collectionId)
  return item
}
