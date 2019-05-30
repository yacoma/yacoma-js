import { Collection, Contact, Item } from '@lucidogen/data'
import { draggable, droppable, dropStyles } from '@lucidogen/dragdrop'
import {
  extractUserId,
  isContactId,
  isPrivateCollection,
  pairCollectionId,
} from '@lucidogen/security'
import { Children, Icon, Table, TableItem } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { ItemDragProps } from './ItemDrag'
import { ItemIcon } from './ItemIcon'
import { ItemRow } from './Items'
import { ItemTitle } from './ItemTitle'

const MyTable = styled(Table)`
  border-top: ${theme.cardItemBorder};
  height: ${theme.documentWidgetHeight};
`

const MyTableItem = styled(TableItem)`
  ${dropStyles};
`

// Height is made so that we do not have item rows that are half shown in
// table when not scrolling.
export const QuickAccess = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 4.8rem;
  flex-shrink: 0;
`

export const LargeIcon = styled(Icon)`
  font-size: 2rem;
  background: #d0e3e6;
  width: auto;
  height: auto;
  border-radius: 5px;
  padding: 5px 12px;
  box-shadow: 1px 1px 1px 0px #00000059;
  ${dropStyles};
`

export function canShareHere(
  uid: string,
  collection: Collection | Contact | undefined,
  item?: Item
): boolean | string {
  if (!item || !collection) {
    return false
  }
  const itemAccess = item.raw.userAccess[uid]
  if (!itemAccess || !itemAccess.access.includes('a')) {
    return false
  }
  let collId = collection.id
  if (isContactId(collId)) {
    const userId = extractUserId(collId)
    collId = pairCollectionId(uid, userId)
    if (item.raw.collectionAccess[collId]) {
      return 'exist'
    } else {
      return true
    }
  }

  if (item.raw.collectionAccess[collId]) {
    return 'exist'
  }

  const collAccess = collection.raw.userAccess[uid]
  return collAccess && collAccess.access.includes('+')
}

export const Collections: Comp = () => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const uid = ctx.state.data.auth.id
  const drag = ctx.state.dragdrop.drag
  let dragItem: Item | undefined
  if (drag && drag.payload) {
    dragItem = data.getItem(ctx, drag.payload.id)
  }

  const { search } = ctx.state.document
  const allCollections = data.collectionList(ctx, {
    title: search,
  })

  const searchedItems = search
    ? data.itemList(ctx, { title: search }, undefined, ['Item'])
    : []

  return (
    <MyTable>
      {allCollections.map((collection, idx) => (
        <MyTableItem
          key={idx}
          {...droppable(ctx, {
            drop: 'Item',
            enable: canShareHere(uid, collection, dragItem),
            payload: { targetId: collection.id },
            onDrop: ctx.actions.chat.shareItem,
          })}
          {...draggable<ItemDragProps>(ctx, {
            drag: 'Collection',
            enable: !isPrivateCollection(collection),
            payload: {
              type: 'Collection',
              id: collection.id,
            },
            onClick() {
              ctx.actions.data.selectCollection(collection.id)
            },
          })}
        >
          <ItemIcon item={collection} />
          <ItemTitle item={collection} />
          <Children family="documentCollection" collectionId={collection.id} />
        </MyTableItem>
      ))}
      {searchedItems.map((item, idx) => (
        <ItemRow key={idx} item={item} />
      ))}
    </MyTable>
  )
}
