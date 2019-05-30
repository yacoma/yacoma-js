import * as React from 'react'
import { styled } from '../../app'

// FIXME: drag & drop support
// import { Drag } from 'drag'
// export const DragBar = Drag.extend`

const DragDiv = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: -11px;
  width: 10px;
  bottom: 0;
  &.selected {
    background: #fdebcc;
  }
  &:hover {
    background: #ffe1af;
  }
`

export function DragBar(props: any) {
  return <DragDiv {...props} />
}
