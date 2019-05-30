import { Icon } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface SearchIconProps {
  className?: string
}

const MyIcon = styled(Icon)`
  opacity: 0.2;
  &:hover {
    opacity: 0.8;
  }
  &.highlighted {
    opacity: 0.8;
    color: ${theme.explorerTitleBackground};
  }
`

export const SearchIcon: Comp<SearchIconProps> = props => {
  const ctx = useOvermind()
  if (!ctx.state.data.auth.admin) {
    return null
  }
  return (
    <MyIcon
      icon="Search"
      highlighted={ctx.state.styled.show['navigation']['search']}
      onClick={() =>
        ctx.actions.styled.toggleChild({
          family: 'navigation',
          child: 'search',
        })
      }
      {...props}
    />
  )
}
