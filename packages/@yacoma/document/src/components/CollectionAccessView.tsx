import * as React from 'react'
import { InspectorIcon, RoundInput } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { CollectionAccessList } from './CollectionAccessList'
import { TitleIcon } from './ExplorerWidget'
import { Widget, WidgetTitle } from './Widget'

export const CollectionAccessIcon = styled(InspectorIcon)`
  &.highlighted {
    color: ${theme.accessTitleBackground};
  }
`

export interface CollectionAccessProps {
  className?: string
}

export const AccessTitleIcon = styled(TitleIcon)`
  margin: 0 0.8rem 0 0;
  color: white;
`

export const CollectionAccessView: Comp<CollectionAccessProps> = ({
  className,
}) => {
  const app = useOvermind()
  return (
    <Widget className={className}>
      <WidgetTitle
        className="access"
        onClick={() =>
          app.actions.styled.toggleChild({
            family: 'document',
            child: 'CollectionAccess',
          })
        }
      >
        <AccessTitleIcon icon="CollectionAccess" />
        <RoundInput
          className="light"
          name="collectionSearch"
          placeholder
          reset
          form={app.state.document.form}
        />
      </WidgetTitle>
      <CollectionAccessList />
    </Widget>
  )
}
