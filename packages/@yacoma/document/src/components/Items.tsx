import classnames from 'classnames'
import * as React from 'react'
// import { Drop } from 'drag'
import { FileItem, isFile, Item } from '@yacoma/data'
import { RelativeDate } from '@yacoma/date'
import { draggable, droppable, dropStyles, fileDrop } from '@yacoma/dragdrop'
import {
  isCollection,
  isPairCollectionId,
  isPrivateCollectionId,
  isWorkCollectionId,
} from '@yacoma/security'
import { Icon, Table, TableItem } from '@yacoma/styled'
import { Comp, Context, styled, theme, useOvermind } from '../app'
import { ItemDragProps } from './ItemDrag'
import { ItemIcon } from './ItemIcon'
import { ItemTitle } from './ItemTitle'

const MyTableItem = styled(TableItem)`
  position: relative;
  ${dropStyles};
  &.Selected {
    background: ${theme.explorerSelectedBackground};
  }
`

const UploadBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  background: ${theme.explorerUploadBackground};
  border-radius: 2px;
  height: 4px;
  margin: 0 5px;
`

const UploadProgress: Comp<{ item: FileItem }> = ({ item }) => {
  useOvermind()
  const uploaded = item.$uploaded || 0
  const width = `${Math.floor(uploaded * 100)}%`
  return <UploadBar style={{ width }} />
}

function findFirstCollectionId(ctx: Context, item: Item): string {
  return (
    Object.keys(item.raw.collectionAccess).find(collId =>
      isWorkCollectionId(collId)
        ? ctx.state.db.WorkCollection[collId] !== undefined
        : isPrivateCollectionId(collId)
        ? ctx.state.db.PrivateCollection[collId] !== undefined
        : isPairCollectionId(collId)
        ? ctx.state.db.PairCollection[collId] !== undefined
        : ctx.state.db.Collection[collId] !== undefined
    ) ||
    // Should never be '' because if the item is shown, it
    // means that the item is shared through a collection.
    ''
  )
}

const MyTable = styled(Table)`
  ${dropStyles};
  border-top-width: 0;
  border-left: ${theme.cardItemBorder};
`

export const DropWrap = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  flex-direction: column;
`

const ItemDate = styled(RelativeDate)`
  cursor: pointer;
  font-size: ${theme.explorerDateFontSize};
  font-weight: normal;
  color: ${theme.explorerDateColor};
  padding-right: 3px;
`

const NoDocuments = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.noDocumentColor};
`

export const ItemRow: Comp<{ item: Item }> = ({ item }) => {
  const ctx = useOvermind()
  const { selectedCollectionId: collectionId, selected } = ctx.state.document
  return (
    <MyTableItem
      className={classnames({
        Selected: selected && item.id === selected.id,
      })}
      {...draggable<ItemDragProps>(ctx, {
        drag: 'Item',
        // FIXME: only enable if share access is allowed...
        enable: !isPrivateCollectionId(item.id),
        payload: {
          // This type is used to allow
          // drop.
          type: 'Item',
          id: item.id,
        },
        onClick() {
          if (isCollection(item)) {
            ctx.actions.data.selectCollection(item.id)
          } else {
            ctx.actions.data.select({
              id: item.id,
              collectionId: collectionId || findFirstCollectionId(ctx, item),
            })
          }
        },
      })}
    >
      <ItemIcon item={item} />
      <ItemTitle item={item} />
      <ItemDate
        date={item.raw.editedAt || Date.now()}
        // We have to use onMouseDown because we
        // are in a draggable context.
        onMouseUp={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          ctx.actions.styled.valueChanged({
            form: ctx.state.document,
            name: 'sort',
            value: ctx.state.document.sort === 'date' ? 'title' : 'date',
          })
        }}
      />
      {isFile(item) && item.$uploaded !== undefined ? (
        <UploadProgress item={item} />
      ) : null}
    </MyTableItem>
  )
}

const ToggleViewWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  background: ${theme.tableBackground};
  left: 1px;
  top: -33px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: #899eb1;
  & span.highlighted {
    color: #45596b;
  }
  padding: 2px 3px;
  margin: 0;
  z-index: 9;
  width: min-content;
`

export const ToggleView: Comp = () => {
  const ctx = useOvermind()
  const form = ctx.state.document
  const { view } = form
  return (
    <ToggleViewWrapper>
      <Icon
        icon="Messages"
        highlighted={view === 'Messages'}
        onClick={() =>
          ctx.actions.styled.valueChanged({
            form,
            name: 'view',
            value: 'Messages',
          })
        }
      />
      <Icon
        icon="Items"
        highlighted={view === 'Items'}
        onClick={() =>
          ctx.actions.styled.valueChanged({
            form,
            name: 'view',
            value: 'Items',
          })
        }
      />
      <Icon
        icon="Users"
        highlighted={view === 'Users'}
        onClick={() =>
          ctx.actions.styled.valueChanged({
            form,
            name: 'view',
            value: 'Users',
          })
        }
      />
    </ToggleViewWrapper>
  )
}

export const Items: Comp<{ collectionId: string }> = ({ collectionId }) => {
  const ctx = useOvermind()
  const ref = React.useRef(null)

  const { data } = ctx.effects

  let list: Item[] = []
  let drop: any = {}

  drop = Object.assign(
    {},
    fileDrop(ctx, {
      ref,
      payload: { open: true, collectionId },
      onDrop: ctx.actions.data.upload,
    }),
    droppable(ctx, {
      drop: 'Item',
      enable: !isPrivateCollectionId(collectionId),
      payload: { targetId: collectionId },
      onDrop: ctx.actions.chat.addAttachment,
    })
  )

  list = data.itemList(ctx, { collectionId }, ctx.state.document.sort, ['Item'])
  const { translate } = ctx.state.locale

  return (
    <DropWrap>
      <ToggleView />
      <MyTable {...drop}>
        {list.length ? (
          list.map((item, idx) => <ItemRow key={idx} item={item} />)
        ) : (
          <NoDocuments>
            <div>{translate('NoDocuments')}</div>
          </NoDocuments>
        )}
      </MyTable>
    </DropWrap>
  )
}
