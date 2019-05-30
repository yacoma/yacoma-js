import { Item, ItemStringified } from '../../types'

const PARSED_FIELDS: (
  | 'collectionAccess'
  | 'userAccess'
  | 'accessChangeLog')[] = ['collectionAccess', 'userAccess', 'accessChangeLog']

export function stringifyFields(item: Item): ItemStringified {
  return Object.assign(
    {},
    item,
    ...PARSED_FIELDS.map(
      key =>
        item[key]
          ? {
              [key]: JSON.stringify(item[key]),
            }
          : {}
    )
  )
}

export function parseFields(item: ItemStringified): Item {
  return Object.assign(
    {},
    item,
    ...PARSED_FIELDS.map(
      key =>
        item[key]
          ? {
              [key]: JSON.parse(item[key]),
            }
          : {}
    )
  )
}
