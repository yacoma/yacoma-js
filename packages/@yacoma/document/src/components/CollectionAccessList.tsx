import { collectionList, getItem, Item } from '@lucidogen/data'
import { Spacer } from '@lucidogen/styled'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { ItemIcon } from './ItemIcon'
import { ItemTitle } from './ItemTitle'
import { WidgetFlagIcon, WidgetItem, WidgetTable } from './Widget'

export interface CollectionAccessListProps {
  className?: string
  onlyChanged?: boolean
}

const AWrapper = styled.div`
  color: #888;
  margin-right: 5px;
`

export const Access: Comp<{
  access: boolean
  changed: boolean
  className?: string
}> = ({ access, changed, className }) => {
  // track
  useOvermind()
  const icon =
    // xor
    (access && !changed) || (!access && changed)
      ? 'AccessCheckOn'
      : 'AccessCheck'
  return (
    <AWrapper className={className}>
      <WidgetFlagIcon
        icon={icon}
        className={classnames({ active: access, changed })}
      />
    </AWrapper>
  )
}

export const CollectionAccessList: Comp<CollectionAccessListProps> = ({
  className,
  onlyChanged,
}) => {
  const ctx = useOvermind()
  // FIXME: Show user list for collection sharing...
  const { current, form } = ctx.state.document
  if (!current) {
    return null
  }
  const { collectionAccess } = current.raw

  let list: { item: Item; access: boolean; changed: boolean }[] = []
  if (onlyChanged) {
    list = Object.keys(form.collectionAccess)
      .map(collId => getItem(ctx, collId))
      .filter(item => item)
      .map(item => ({
        item: item!,
        access: !!collectionAccess[item!.id],
        changed: true,
      }))
  } else {
    const all = collectionList(ctx, { title: form.collectionSearch })
    // With access
    const list_a = all.filter(item => collectionAccess[item.id]).map(item => ({
      item,
      access: true,
      changed: form.collectionAccess[item.id] !== undefined,
    }))
    const list_b = all.filter(item => !collectionAccess[item.id]).map(item => ({
      item,
      access: false,
      changed: form.collectionAccess[item.id] !== undefined,
    }))
    list = [...list_a, ...list_b]
  }

  return (
    <WidgetTable className={className}>
      {list.map(({ item, access, changed }, idx) => (
        <WidgetItem
          key={idx}
          className={changed ? 'changed' : ''}
          onClick={() =>
            ctx.actions.document.toggleCollectionAccess({
              collectionId: item.id,
            })
          }
        >
          <ItemIcon item={item} />
          <ItemTitle item={item} />
          <Spacer />
          <Access access={access} changed={changed} />
        </WidgetItem>
      ))}
    </WidgetTable>
  )
}
