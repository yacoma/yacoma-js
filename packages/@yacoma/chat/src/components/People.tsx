import { getItem, Item } from '@lucidogen/data'
import {
  canShareHere,
  ItemDragProps,
  ItemIcon,
  ItemRow,
} from '@lucidogen/document'
import { draggable, droppable, dropStyles } from '@lucidogen/dragdrop'
import { Children, Icon, Table, TableItem, RoundInput } from '@lucidogen/styled'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { ContactTitle, contactTitle } from './ContactTitle'

export interface PeopleProps {
  className?: string
  type: 'small' | 'large'
}

const Wrapper = styled.div`
  height: ${theme.documentWidgetHeight};
  flex-grow: 1;
  &.small {
    width: ${theme.chatExplorerSmallWidth};
    flex-grow: 0;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Search = styled.div`
  background: ${theme.explorerBackground};
  padding: 5px 10px;
`

const MyTableItem = styled(TableItem)`
  ${dropStyles};
  &.selected {
    background: ${theme.explorerSelectedBackground};
  }
`

const MyIcon = styled(Icon)`
  cursor: pointer;
  color: #c7c7c7;
  &:hover {
    color: #7d7c7c;
  }
`

export const EditCollectionIcon: Comp<{ id: string }> = ({ id }) => {
  const ctx = useOvermind()
  const { selected } = ctx.state.document
  const selectedId = selected && selected.id
  return (
    <MyIcon
      icon="Edit"
      highlighted={selectedId === id}
      onMouseDown={e => {
        e.stopPropagation()
        ctx.actions.data.select({ collectionId: id, id })
      }}
    />
  )
}

export const People: Comp<PeopleProps> = ({ className, type }) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const uid = ctx.state.data.auth.id
  const collectionId = ctx.state.document.selectedCollectionId
  const drag = ctx.state.dragdrop.drag
  let dragItem: Item | undefined
  if (drag && drag.payload) {
    dragItem = getItem(ctx, drag.payload.id)
  }

  const { search } = ctx.state.document
  const hasSearch = ctx.state.styled.show['navigation']['search']
  const allCollections = data.collectionList(
    ctx,
    hasSearch
      ? {
          title: search,
        }
      : {}
  )

  const searchedItems =
    hasSearch && search
      ? data
          .itemList(ctx, { title: search }, undefined, ['Item'])
          .filter(item => item.type !== 'Contact') // TODO Allow search for admin
      : []
  const { selectedTheme } = ctx.state.theme

  return (
    <Wrapper className={classnames(className, type)}>
      {hasSearch && (
        <Search>
          <RoundInput
            autoFocus
            onFocus={e => e.target.select()}
            className="light"
            name="search"
            placeholder
            reset
            form={ctx.state.document}
          />
        </Search>
      )}
      <Table>
        {allCollections.map((elem, idx) => (
          <MyTableItem
            key={idx}
            {...droppable(ctx, {
              className:
                collectionId && elem.id === collectionId ? 'selected' : '',
              drop: { Item: true, Collection: true },
              enable: canShareHere(uid, elem, dragItem),
              payload: {
                targetId: elem.id,
                // FIXME: Why do we need targetType ?
                targetType: elem.type,
              },
              onDrop: ctx.actions.chat.shareItem,
            })}
            {...draggable<ItemDragProps>(ctx, {
              drag: 'Item',
              payload: {
                type: 'Item',
                id: elem.id,
              },
              onClick() {
                ctx.actions.data.selectCollection(elem.id)
              },
            })}
          >
            <ItemIcon item={elem} />
            <ContactTitle>
              {contactTitle(
                ctx,
                elem.id,
                type === 'small'
                  ? selectedTheme.chatExplorerSmallTitleLimit
                  : undefined
              )}
            </ContactTitle>
            {type === 'large' && (
              <Children family="chatCollection" id={elem.id} />
            )}
          </MyTableItem>
        ))}
        {searchedItems.map((item, idx) => (
          <ItemRow key={idx} item={item} />
        ))}
      </Table>
    </Wrapper>
  )
}
