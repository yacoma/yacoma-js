import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'

export interface DialogProps {
  className?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  */
`

export const Dialog: Comp<DialogProps> = ({ children, className }) => {
  const app = useOvermind()
  const components = app.state.dialog.components()

  const show = app.state.dialog.show
  if (!show) {
    return <Wrapper className={className}>{children}</Wrapper>
  }
  const settings = components[show]
  if (!settings) {
    throw new Error(`Cannot show dialog '${show}' (missing component).`)
  }
  const Comp = settings.component
  return (
    <Wrapper className={className}>
      <Comp />
      {settings.exclusive ? null : children}
    </Wrapper>
  )
}
