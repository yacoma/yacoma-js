import * as React from 'react'
import { Items, Widget } from '@yacoma/document'
import { InspectorIcon } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { Messages } from './Messages'
import { People } from './People'
import { Users } from './Users'

export interface ExplorerProps {
  className?: string
}

const ExplorerWidget = styled(Widget)`
  background: ${theme.contactsWidgetBackground};
  flex-direction: row;
`

export const ExplorerWidgetIcon = styled(InspectorIcon)`
  margin-right: 1rem;
  color: ${theme.explorerBackground};
  &.highlighted {
    color: ${theme.explorerTitleBackground};
  }
`

const VIEWS: { [key: string]: Comp<{ collectionId: string }> } = {
  Items,
  Messages,
  Users,
}

export const Explorer: Comp<ExplorerProps> = ({ className }) => {
  const ctx = useOvermind()
  const collectionId = ctx.state.document.selectedCollectionId
  const { view } = ctx.state.document
  const hasSearch = ctx.state.styled.show['navigation']['search']
  const View = VIEWS[view] || Items
  const showDetails = collectionId && !hasSearch
  return (
    <ExplorerWidget className={className}>
      <People type={showDetails ? 'small' : 'large'} />
      {showDetails ? <View collectionId={collectionId!} /> : null}
    </ExplorerWidget>
  )
}
