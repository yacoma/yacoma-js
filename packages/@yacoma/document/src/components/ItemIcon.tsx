import { Item, isPairCollection, isFile } from '@lucidogen/data'
import { DraggableHooks } from '@lucidogen/dragdrop'
import {
  isPrivateCollectionId,
  workCollectionId,
  otherUserIdFromPairCollection,
} from '@lucidogen/security'
import { Icon } from '@lucidogen/styled'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface ItemIconProps extends Partial<DraggableHooks> {
  className?: string
  item: Item
}

const TheIcon = styled(Icon)`
  &.Shared {
    color: ${theme.sharedColor};
  }
  &.Private {
    color: ${theme.privateColor};
  }
`

export const ItemIcon: Comp<ItemIconProps> = ({
  className,
  item,
  ...props
}) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const { state } = ctx
  let icon: string = item.type
  const shared = data.isShared(ctx, item)
  const { id } = item
  const uid = state.data.auth.id

  if (id === workCollectionId(uid)) {
    icon = 'MyCollection'
  } else if (icon === 'Collection' && !shared) {
    icon = 'OwnCollection'
  } else if (isPairCollection(item)) {
    const userId = otherUserIdFromPairCollection(state.data.auth.id, item.raw)
    const user = state.db.User[userId]
    icon = user && user.admin ? 'AdminUser' : 'PairCollection'
  } else if (isFile(item)) {
    if (item.$uploaded !== undefined) {
      icon = 'FileUpload'
    } else {
      const type = item.fileType
      if (type === 'application/pdf') {
        icon = 'FilePdf'
      } else if (type.includes('image')) {
        icon = 'FileImage'
      }
    }
  }

  return (
    <TheIcon
      className={classnames(className, icon, {
        Shared: data.isShared(ctx, item),
        Private: isPrivateCollectionId(item.id),
      })}
      icon={icon}
      {...props}
    />
  )
}
