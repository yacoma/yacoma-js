import * as React from 'react'
import { TableItem } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { ItemIcon } from './ItemIcon'
import { ItemTitle } from './ItemTitle'

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
