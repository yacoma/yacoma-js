import { ToggleView, UserAccessIcons } from '@lucidogen/document'
import { dropStyles } from '@lucidogen/dragdrop'
import {
  pairCollectionId,
  privateCollectionId,
  workCollectionId,
} from '@lucidogen/security'
import { Table, TableItem, Icon } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { DropWrap } from './Messages'

export interface UsersProps {
  className?: string
  collectionId: string
}

const MyTable = styled(Table)`
  ${dropStyles};
  border-top-width: 0;
  border-left: ${theme.cardItemBorder};
`

const NoUsers = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.noDocumentColor};
`

const Username = styled.div`
  flex-grow: 1;
`

export const Users: Comp<UsersProps> = ({ className }) => {
  const ctx = useOvermind()
  const { translate } = ctx.state.locale
  const { data } = ctx.effects
  const uid = ctx.state.data.auth.id
  const { selectedCollectionId: collectionId } = ctx.state.document
  if (!collectionId) {
    return null
  }
  const collection = data.getItem(ctx, collectionId)
  if (!collection) {
    return null
  }
  const { userAccess } = collection.raw
  const list = Object.keys(userAccess)
    .map(userId => {
      const user = ctx.state.db.User[userId] || { username: userId.slice(0, 8) }
      const access = userAccess[userId].access
      let currentValue: string = ''
      if (access.includes('a')) {
        currentValue = '1'
      } else if (access.includes('e')) {
        currentValue = '2'
      } else if (access.includes('r')) {
        currentValue = '3'
      }

      return { user, sort: `${currentValue}-${user.username}` }
    })
    .sort((a, b) => (a.sort > b.sort ? 1 : -1))
  return (
    <DropWrap
      className={className}
      drop={{ Item: true, Collection: true }}
      payload={{ targetId: collectionId }}
      onDrop={ctx.actions.chat.addAttachment}
    >
      <ToggleView />
      <MyTable /*{...drop}*/>
        {list.length ? (
          list.map(({ user }, idx) => (
            <TableItem
              onClick={() => {
                let collId = ''
                if (user.id === uid) {
                  collId = privateCollectionId(uid)
                } else if (user.protected) {
                  collId = workCollectionId(user.id)
                } else {
                  collId = pairCollectionId(uid, user.id)
                }
                if (collId === collectionId) {
                  // selecting again would toggle
                } else {
                  ctx.actions.data.selectCollection(collId)
                }
                ctx.actions.styled.valueChanged({
                  form: ctx.state.document,
                  name: 'view',
                  value: 'Messages',
                })
              }}
              key={idx}
            >
              <Icon icon={user.protected ? 'ProtectedUser' : 'User'} />
              <Username>{user.username}</Username>
              <UserAccessIcons
                noEdit
                access={userAccess[user.id].access}
                userId={user.id}
              />
            </TableItem>
          ))
        ) : (
          <NoUsers>
            <div>{translate('Private')}</div>
          </NoUsers>
        )}
      </MyTable>
    </DropWrap>
  )
}
