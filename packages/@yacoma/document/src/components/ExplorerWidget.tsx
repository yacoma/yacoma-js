import * as React from 'react'
import { Icon, RoundInput, Spacer } from '@yacoma/styled'
import { Comp, styled, useOvermind } from '../app'
import { Collections } from './Collections'
import { ItemIcon } from './ItemIcon'
import { Items } from './Items'
import { Widget, WidgetTitle } from './Widget'

export interface ExplorerWidgetProps {
  className?: string
}

export const TitleIcon = styled(Icon)`
  margin: 0 0.5rem;
  font-size: 1.2rem;
`

const SelectedIcon = styled(ItemIcon)`
  margin: 0 8px 0 0;
`

export const ExplorerWidget: Comp<ExplorerWidgetProps> = ({ className }) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const { selectedCollectionId: collectionId, search } = ctx.state.document
  const collView = collectionId && !search
  let item: any
  if (collView) {
    item = data.getItem(ctx, collectionId!)
  }
  const dragging = ctx.state.dragdrop.drag
  const type = dragging || search || !collectionId ? 'collections' : 'items'

  if (item && type === 'items') {
    return (
      <Widget className={className}>
        <WidgetTitle
          className="submenu"
          onClick={() => ctx.actions.data.selectCollection(undefined)}
        >
          <SelectedIcon item={item} />
          {data.itemTitle(ctx, item)}
          <Spacer />
          {/*
          <TitleIcon
            icon="Chat"
            onClick={() =>
              ctx.actions.chat.select({
                id: item.id,
                force: true,
              })
            }
          />
          */}
          <TitleIcon
            icon="Edit"
            onClick={() =>
              ctx.actions.data.select({
                id: collectionId!,
                collectionId: collectionId!,
              })
            }
          />
        </WidgetTitle>
        {collectionId && <Items collectionId={collectionId} />}
      </Widget>
    )
  } else {
    return (
      <Widget className={className}>
        <WidgetTitle
          onClick={e => {
            const target = e.target as HTMLElement
            if (target.tagName !== 'INPUT') {
              ctx.actions.styled.toggleChild({
                family: 'navigation',
                child: 'explorer',
              })
            }
          }}
        >
          <RoundInput
            className="light"
            name="search"
            placeholder
            reset
            form={ctx.state.document}
          />
          <TitleIcon
            icon="NewCollection"
            onClick={() => ctx.actions.document.new({ type: 'Collection' })}
          />
        </WidgetTitle>

        <Collections />
      </Widget>
    )
  }
}
