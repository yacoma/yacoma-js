import * as React from 'react'
import { Comp, styled, theme } from '../../app'
import { Children } from '../Children'

export interface InspectorGroupProps {
  className?: string
  family: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:first-child) {
    border-bottom: #333;
  }
  &.hidden {
    visibility: hidden;
  }
`

const Tools = styled(Children)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  height: ${theme.inspectorTitleHeight};
  font-size: ${theme.inspectorTitleFontSize};
  background: ${theme.inspectorTitleBackground};
  color: ${theme.inspectorTitleColor};
  border-bottom: ${theme.inspectorTitleBorderBottom};
`

export const ChildrenInRow = styled(Children)`
  display: flex;
  flex-direction: row;
`

export const Content = styled(Children)`
  display: flex;
  &:not(.Groups) {
    flex-direction: row;
  }
  &.Groups {
    flex-direction: column;
  }
  &.Groups .Group {
    display: flex;
    flex-direction: row;
  }
`

export const InspectorGroup: Comp<InspectorGroupProps> = ({
  className,
  family,
}) => (
  <Wrapper className={className}>
    <Tools family={`${family}Toolbar`} />
    <Content family={family} />
  </Wrapper>
)
