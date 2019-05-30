import * as React from 'react'
import { Item } from '@yacoma/data'
import { Comp, styled, theme, useOvermind } from '../app'

export interface ItemTitleProps {
  className?: string
  item: Item
}

const Wrapper = styled.span`
  cursor: pointer;
  word-break: break-word;
  position: relative;
  flex-grow: 1;
  padding: 0 ${theme.iconMargin} 0 0;
`

export const ItemTitle: Comp<ItemTitleProps> = ({ className, item }) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  return <Wrapper className={className}>{data.itemTitle(ctx, item)}</Wrapper>
}
