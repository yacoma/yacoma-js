import * as React from 'react'
import { Icon } from '@yacoma/styled'
import { Comp, styled, useOvermind } from '../app'

export interface NewItemIconProps {
  className?: string
}

export const NewIcon = styled(Icon)`
  opacity: 0.4;
  &:hover {
    opacity: 1;
  }
`

export const NewItemIcon: Comp<NewItemIconProps> = () => {
  const ctx = useOvermind()
  const collectionId = ctx.state.document.selectedCollectionId

  return (
    <NewIcon
      icon="NewDocument"
      onClick={() => ctx.actions.document.new({ type: 'Item', collectionId })}
    />
  )
}

export const NewCollectionIcon: Comp<NewItemIconProps> = () => {
  const ctx = useOvermind()

  return (
    <NewIcon
      icon="NewCollection"
      onClick={() => ctx.actions.document.new({ type: 'Collection' })}
    />
  )
}
