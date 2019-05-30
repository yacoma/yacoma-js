import { TableItem } from '@lucidogen/styled'
import * as React from 'react'
import { ItemIcon } from './ItemIcon'
import { ItemTitle } from './ItemTitle'
import { theme, styled, Comp, useOvermind } from '../app'

export interface ItemDragProps {
  id: string
  type: 'Item' | 'Collection'
}

const MyTableItem = styled(TableItem)`
  background: #999;
  border-radius: 5px;
  &,
  &:first-child {
    border: ${theme.cardBorder};
  }
`

export const ItemDrag: Comp<ItemDragProps> = ({ id, type }) => {
  const app = useOvermind()
  const item = app.state.db[type][id]
  return (
    <MyTableItem>
      <ItemIcon item={item} />
      <ItemTitle item={item} />
    </MyTableItem>
  )
}
