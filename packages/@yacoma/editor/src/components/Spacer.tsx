import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { caretSelection, CompositionHolder } from '../lib'

export interface SpacerProps {
  prevRef: string
  holder: CompositionHolder
}

const Wrapper = styled.div`
  padding: 4px 0;
  &:hover div {
    opacity: 1;
  }
`

const Line = styled.div`
  background: #ccc;
  height: 2px;
  opacity: 0;
  transition: opacity 0.5s;
  @media print {
    & {
      display: none;
    }
  }
`

export const Spacer: Comp<SpacerProps> = ({ holder, prevRef }) => {
  const app = useOvermind()
  const insertPara = app.actions.editor.enterPress
  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    // FIXME: Using 0 does not always indicate the end of the previous paragraph
    // Maybe we should use -1 and handle this.
    const selection = caretSelection([prevRef], 0)
    insertPara({ holder, selection })
  }

  return (
    <Wrapper onClick={onClick}>
      <Line />
    </Wrapper>
  )
}
