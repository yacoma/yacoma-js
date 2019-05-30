import * as React from 'react'
import { Comp, css, styled, useOvermind } from '../app'
import { droppable } from '../droppable'
import { DroppableOptions } from '../types'

export const dropStyles = css`
  border: 2px dashed rgba(0, 0, 0, 0); /* empty border to avoid movement on hover */
  &.dropZone,
  &.fileDrop {
    animation: DropPulse 2s alternate ease-in-out infinite;
    background-color: rgba(255, 200, 0, 0.4);
  }
  &.dropZone:hover,
  &.fileDrop {
    animation: none;
    background-color: rgba(255, 200, 0, 0.7);
    border-color: black;
  }
  &.noDrop {
    background: #6b6b6b;
  }
  &.exist {
    background-color: #587d5de3;
  }
`

const Wrapper = styled.div`
  ${dropStyles};
`

export const Drop: Comp<DroppableOptions> = ({ children, ...props }) => {
  const ctx = useOvermind()
  return <Wrapper {...droppable(ctx, props)}>{children}</Wrapper>
}
