import * as React from 'react'
import { Comp, styled, theme } from '../../app'
import { Children } from '../Children'
import { ScrollDiv } from '../ScrollDiv'
export * from './InspectorGroup'
export * from './InspectorIcon'
export * from './InspectorWidget'

const Wrap = styled(ScrollDiv)`
  min-width: ${theme.inspectorWidth};
  background: #484545;
  box-shadow: 0px 0px 10px #252525;
  z-index: 7;
  flex-shrink: 0;
  overflow: auto;
`

const Groups = styled(Children)`
  display: flex;
  flex-direction: column;
`

export interface InspectorProps {
  className?: string
  name?: string
}

export const Inspector: Comp<InspectorProps> = ({ name, className }) => (
  <Wrap className={className}>
    <Groups family={name || 'inspector'} />
  </Wrap>
)
