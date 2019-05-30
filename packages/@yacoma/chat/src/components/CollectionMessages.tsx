import * as React from 'react'
import { Message } from '@yacoma/data'
import { RelativeDate } from '@yacoma/date'
import { Icon, Table } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { Attachment } from './Attachment'

export interface CollectionMessagesProps {
  collectionId: string
}

const Author = styled.span`
  font-weight: bold;
  color: ${theme.chatAuthorColor};
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  &.me {
    flex-direction: row-reverse;
  }
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.2rem;
`

const MyTable = styled(Table)`
  border-left: ${theme.cardItemBorder};
  background: ${theme.tableBackground};
  margin-top: 0; /* needed for drag/drop operation */
  display: flex;
  flex-grow: 1;
`

const MyItem = styled.div`
  font-size: ${theme.chatMessageFontSize};
  flex-shrink: 0;
  flex-grow: 0;
  margin: ${theme.chatMessageMargin};
  &.me {
    margin: ${theme.chatMessageMeMargin};
  }
  &.me .Message {
    background: ${theme.chatMessageMeBackground};
  }
`

const MessageWrap = styled.div`
  cursor: pointer;
  line-height: ${theme.chatLineHeight};
  white-space: pre-line;
  overflow: hidden;
  position: relative;
  border: ${theme.chatMessageBorder};
  padding: ${theme.chatMessagePadding};
  border-radius: 8px;
  &:first-child {
    border-top: ${theme.chatMessageBorder};
  }
`

const DateWrap = styled.div`
  position: relative;
  height: 0;
`

const DateSpan = styled(RelativeDate)`
  position: absolute;
  bottom: ${theme.chatDateBottom};
  right: ${theme.chatDateRight};
  font-size: ${theme.chatDateFontSize};
  font-style: ${theme.chatDateFontStyle};
  color: ${theme.chatDateColor};
`

const Attachments: Comp<{
  collectionId: string
  message: Message
}> = ({ collectionId, message }) => {
  const { attachments } = message
  if (!attachments) {
    return null
  }
  return (
    <React.Fragment>
      {Object.keys(attachments)
        .map(key => ({ key, attach: attachments[key] }))
        .map(({ key, attach }) => (
          <Attachment
            {...attach}
            collectionId={collectionId}
            key={key}
            limit={18}
          />
        ))}
    </React.Fragment>
  )
}

const ExtraIcon = styled(Icon)`
  position: absolute;
  right: 2px;
  bottom: -4px;
  font-size: 0.9rem;
  color: #555;
  margin: 0;
`

const ExtraBar = styled.div`
  position: absolute;
  right: 0px;
  top: 0;
  bottom: 0;
  width: 22px;
`

export const ShowMessage: Comp<{
  message: Message
  uid: string
  collectionId: string
  author: string
}> = React.memo(({ author, collectionId, message, uid }) => {
  const ctx = useOvermind()
  const { raw } = message
  if (raw.revision === 0) {
    return null
  }
  const hasExtra = Object.keys(message).find(
    k => k !== 'title' && k !== 'attachments' && k !== 'raw' && !(raw as any)[k]
  )
  return (
    <MyItem
      className={uid === message.raw.creator ? 'me' : ''}
      key={message.id}
      onClick={() =>
        ctx.actions.data.select({
          id: message.id,
          collectionId,
        })
      }
    >
      {uid === message.raw.creator ? null : (
        <Heading>
          <Author>{author}</Author>
        </Heading>
      )}
      <MessageWrap className="Message">
        {hasExtra && (
          <ExtraBar>
            <ExtraIcon icon="MessageExtra" />
          </ExtraBar>
        )}
        {message.title}
        <Attachments collectionId={collectionId} message={message} />
      </MessageWrap>
      <DateWrap>
        <DateSpan date={message.raw.createdAt} />
      </DateWrap>
    </MyItem>
  )
})

export const CollectionMessages: Comp<CollectionMessagesProps> = ({
  collectionId,
}) => {
  const ctx = useOvermind()
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (ref) {
      ref.scrollTop = ref.scrollHeight
    }
  })

  const contacts = ctx.state.db.User
  const messages = collectionId ? ctx.state.msgDb[collectionId] : {}
  const uid = ctx.state.data.auth.id
  const translate = ctx.state.locale.translate

  const list = Object.keys(messages || {})
    .map(id => messages[id])
    .sort((a, b) => (b.raw.createdAt < a.raw.createdAt ? 1 : -1))

  function authorName(userId: string) {
    if (userId === uid) {
      return translate('Me')
    } else {
      const user = contacts[userId]
      return user ? user.username : '???'
    }
  }

  return (
    <MyTable containerRef={(e: any) => setRef(e)}>
      {list.map(message => (
        <ShowMessage
          key={message.id}
          message={message}
          uid={uid}
          collectionId={collectionId}
          author={authorName(message.raw.creator)}
        />
      ))}
    </MyTable>
  )
}
