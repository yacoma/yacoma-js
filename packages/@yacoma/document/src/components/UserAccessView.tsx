import * as React from 'react'
import { RoundInput } from '@yacoma/styled'
import { Comp, useOvermind } from '../app'
import { AccessTitleIcon } from './CollectionAccessView'
import { UserAccessList } from './UserAccessList'
import { Widget, WidgetTitle } from './Widget'

export { CollectionAccessIcon as UserAccessIcon } from './CollectionAccessView'

export interface UserAccessViewProps {
  className?: string
}

export const UserAccessView: Comp<UserAccessViewProps> = ({ className }) => {
  const app = useOvermind()
  const item = app.state.document.current
  if (!item) {
    return null
  }

  return (
    <Widget className={className}>
      <WidgetTitle
        className="access"
        onClick={() =>
          app.actions.styled.toggleChild({
            family: 'document',
            child: 'UserAccess',
          })
        }
      >
        <AccessTitleIcon icon="UserAccess" />
        <RoundInput
          className="light"
          name="userSearch"
          placeholder
          reset
          form={app.state.document.form}
        />
      </WidgetTitle>
      <UserAccessList />
    </Widget>
  )
}
