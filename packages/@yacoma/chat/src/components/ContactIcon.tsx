import classnames from 'classnames'
import * as React from 'react'
import { isShared } from '@yacoma/data'
import {
  isCollectionId,
  isPairCollectionId,
  isPrivateCollectionId,
  isWorkCollectionId,
  otherUserIdFromPairCollection,
  privateCollectionId,
  workCollectionId,
} from '@yacoma/security'
import { Icon } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'

export interface ItemIconProps {
  className?: string
  id: string
  onClick?: () => void
}

const TheIcon = styled(Icon)`
  &.Shared {
    color: ${theme.sharedColor};
  }
  &.Private {
    color: ${theme.privateColor};
  }
`

export const ContactIcon: Comp<ItemIconProps> = ({
  className,
  id,
  onClick,
}) => {
  const ctx = useOvermind()
  const { state } = ctx
  let icon: string
  const uid = state.data.auth.id
  let Shared: boolean

  if (isCollectionId(id)) {
    if (isPairCollectionId(id)) {
      const coll = state.db.PairCollection[id]
      const userId = otherUserIdFromPairCollection(uid, coll.raw)
      Shared = false
      const user = state.db.User[userId]
      icon = user && user.admin ? 'AdminUser' : 'User'
    } else if (id === privateCollectionId(uid)) {
      Shared = false
      icon = 'PrivateCollection'
    } else if (id === workCollectionId(uid)) {
      const collection = state.db.WorkCollection[id]
      Shared = isShared(ctx, collection)
      icon = 'MeWorkCollection'
    } else if (isWorkCollectionId(id)) {
      const collection = state.db.WorkCollection[id]
      Shared = isShared(ctx, collection)
      icon = 'UsersWorkCollection'
    } else {
      const collection = state.db.Collection[id]
      Shared = isShared(ctx, collection)
      icon = 'UsersCollection'
    }
  } else if (id === uid) {
    Shared = false
    icon = 'UsersPrivate'
  } else {
    // Contact
    Shared = false
    icon = 'User'
  }

  return (
    <TheIcon
      className={classnames(className, {
        Shared,
        Private: isPrivateCollectionId(id),
      })}
      icon={icon}
      onClick={onClick}
    />
  )
}
