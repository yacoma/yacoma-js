import classnames from 'classnames'
import * as React from 'react'
import { Item } from '@yacoma/data'
import { isCollection } from '@yacoma/security'
import { Icon, Spacer } from '@yacoma/styled'
import { Comp, Context, styled, useOvermind } from '../app'
import { WidgetFlagIcon, WidgetItem, WidgetTable } from './Widget'

export interface UserAccessListProps {
  className?: string
  onlyChanged?: boolean
}

const TYPES: ('a' | 'e')[] = ['a', 'e']
const ALL_TYPES: ('a' | 'e' | 'r')[] = ['a', 'e', 'r']

const AccessDiv = styled.div`
  color: #888;
  margin-right: 5px;
`

export const UserAccessIcons: Comp<{
  access: string
  changed?: boolean
  userId: string
  className?: string
  noEdit?: boolean
}> = ({ access, className, noEdit, userId }) => {
  const ctx = useOvermind()
  let currentValue = ''
  if (access.includes('a')) {
    currentValue = 'a'
  } else if (access.includes('e')) {
    currentValue = 'e'
  } else if (access.includes('r')) {
    currentValue = 'r'
  }

  if (noEdit) {
    return (
      <AccessDiv className={className}>
        {ALL_TYPES.map(k => (
          <WidgetFlagIcon
            key={k}
            icon={`Access_${k}`}
            className={classnames({
              active: currentValue === k,
            })}
          />
        ))}
      </AccessDiv>
    )
  } else {
    const formValue = ctx.state.document.form.userAccess[userId]
    return (
      <AccessDiv className={className}>
        {TYPES.map(k => (
          <WidgetFlagIcon
            key={k}
            icon={`Access_${k}`}
            onClick={() =>
              ctx.actions.document.toggleUserAccess({ userId, access: k })
            }
            className={classnames({
              active: currentValue === k,
              changed: formValue && (currentValue === k || formValue === k),
            })}
          />
        ))}
      </AccessDiv>
    )
  }
}

function usersList(ctx: Context, item: Item, onlyChanged?: boolean) {
  const { data } = ctx.effects
  const users = ctx.state.db.User
  const fcollAccess = ctx.state.document.form.collectionAccess
  const fuserAccess = ctx.state.document.form.userAccess
  const userAccess = item.raw.userAccess

  const isViewer: { [userId: string]: boolean } = {}
  // Make sure all changed user access is shown, no matter what is changed in
  // collection access.
  Object.keys(fuserAccess).forEach(userId => (isViewer[userId] = true))

  if (onlyChanged) {
    // Nothing more to show
  } else if (isCollection(item.raw)) {
    Object.keys(userAccess).forEach(userId => (isViewer[userId] = true))
  } else {
    const collectionAccess = Object.assign(
      {},
      item.raw.collectionAccess,
      fcollAccess
    )
    Object.keys(collectionAccess)
      .filter(
        collId =>
          fcollAccess[collId] ||
          (collectionAccess[collId] && fcollAccess[collId] !== false)
      )
      .forEach(collId => {
        const collection = data.getItem(ctx, collId)
        const userAccess = collection ? collection.raw.userAccess : {}
        Object.keys(userAccess).forEach(userId => {
          if (userAccess[userId].access.includes('r')) {
            isViewer[userId] = true
          }
        })
      })
  }

  const { form } = ctx.state.document

  let list = Object.keys(isViewer).map(id => ({
    user: users[id],
    username: users[id].username,
    access: (userAccess[id] || { access: 'r' }).access,
    changed: form.userAccess[id] !== undefined,
  }))
  if (form.userSearch) {
    list = list.filter(data.filterByUsername(form.userSearch))
  }
  list = list
    .map(config => ({
      ...config,
      sort: config.access.includes('a')
        ? `a.${config.user.username}`
        : `b.${config.user.username}`,
    }))
    .sort((a, b) => (a.sort < b.sort ? -1 : 1))
  return list
}

export const UserAccessList: Comp<UserAccessListProps> = ({
  className,
  onlyChanged,
}) => {
  const app = useOvermind()
  const item = app.state.document.current
  if (!item) {
    return null
  }

  const list = usersList(app, item, onlyChanged)
  return (
    <WidgetTable className={className}>
      {list.map(({ user, access, changed }, idx) => (
        <WidgetItem key={idx} className={changed ? 'changed' : ''}>
          <Icon icon="User" />
          {user.username}
          <Spacer />
          <UserAccessIcons userId={user.id} access={access} changed={changed} />
        </WidgetItem>
      ))}
    </WidgetTable>
  )
}
