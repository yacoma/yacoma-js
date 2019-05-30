import { draggable } from '@lucidogen/dragdrop'
import { isCollection } from '@lucidogen/security'
import { Children, Icon } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { Document } from '../types'
import { DocIcon } from './DocIcon'
import { ItemDragProps } from './ItemDrag'
import { Item } from '@lucidogen/data'

const HeadIcon = styled(Icon)`
  &.hasclick:hover {
    color: #444;
  }
  &.highlighted,
  &.highlighted:hover {
    color: #ef9714;
  }
`

export const SaveIcon: Comp<{ holder?: Item }> = ({ holder: item }) => {
  const app = useOvermind()
  const doc = item || (app.state.document.current as Document)
  if (!doc) {
    return null
  }
  return (
    <HeadIcon
      icon="Save"
      highlighted={() => doc.$changed}
      onClick={doc.$changed ? () => app.actions.document.save(doc) : undefined}
    />
  )
}

const Buttons = styled.div`
  color: #ccc;
  display: flex;
  flex-direction: row;
  left: 0;
  margin: 2rem;
  @media print {
    display: none;
  }
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`

const Spacer = styled.div`
  flex-grow: 1;
`

const Wrapper = styled.div`
  position: relative;
  left: 0;
  right: 0;
`

export interface HeaderProps {
  holder: Document
  page: number
  pageCount: number
}

const MyChildren = styled(Children)`
  display: flex;
  flex-direction: row;
`

export const Header: Comp<HeaderProps> = ({ page, holder }) => {
  const app = useOvermind()
  if (!holder) {
    // Loading or no document
    return null
  }
  return (
    <Wrapper contentEditable={false}>
      <Buttons>
        <SaveIcon holder={holder} />
        <MyChildren family="documentHeader" holder={holder} />
        <Spacer />
        <HeadIcon
          icon="Close"
          onClick={() => app.actions.data.select(undefined)}
        />
      </Buttons>
      {page === 1 ? (
        <DocIcon
          item={holder}
          {...draggable<ItemDragProps>(app, {
            drag: isCollection(holder) ? 'Collection' : 'Item',
            payload: {
              type: isCollection(holder) ? 'Collection' : 'Item',
              id: holder.id,
            },
          })}
        />
      ) : null}
    </Wrapper>
  )
}
