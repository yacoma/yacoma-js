import * as React from 'react'
import { Icon } from '@yacoma/styled'
import { Comp, styled, useOvermind } from '../app'

export interface NewContactIconProps {
  className?: string
}

const MyIcon = styled(Icon)`
  margin-right: 1.5rem;
  opacity: 0.15;
  &:hover {
    opacity: 0.5;
  }
`

export const NewContactIcon: Comp<NewContactIconProps> = props => {
  const ctx = useOvermind()
  if (!ctx.state.data.auth.admin) {
    return null
  }
  return (
    <MyIcon
      icon="NewContact"
      onClick={ctx.actions.data.newContact}
      {...props}
    />
  )
}
