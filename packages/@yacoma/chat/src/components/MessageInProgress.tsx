import * as React from 'react'
import { getItem } from '@yacoma/data'
import { ItemIcon } from '@yacoma/document'
import { Drop } from '@yacoma/dragdrop'
import { Comp, styled, theme, useOvermind } from '../app'
import { contactTitle, ContactTitle } from './ContactTitle'
import { Composer } from './Messages'

export interface ChatInProgressProps {
  className?: string
}

const DropWrap = styled(Drop)`
  /* styles here */
  margin: 10px;
  border-radius: 5px;
  box-shadow: ${theme.cardBoxShadow};
  background: ${theme.contactsWidgetBackground};
  flex-grow: 1;
`

const MyComposer = styled(Composer)`
  border: none;
`

const Target = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ChatInProgress: Comp<ChatInProgressProps> = ({ className }) => {
  const ctx = useOvermind()
  const { draft } = ctx.state.chat
  if (!draft) {
    return null
  }
  const { view, selectedCollectionId } = ctx.state.document
  if (selectedCollectionId !== draft.collectionId || view !== 'Messages') {
    const collection = getItem(ctx, draft.collectionId)
    if (!collection) {
      return null
    }
    return (
      <DropWrap
        className={className}
        drop={{ Item: true, Collection: true }}
        payload={{ targetId: draft.collectionId }}
        onDrop={ctx.actions.chat.addAttachment}
      >
        <Target>
          <ItemIcon item={collection} />
          <ContactTitle>{contactTitle(ctx, collection.id)}</ContactTitle>
        </Target>
        <MyComposer collectionId={draft.collectionId} />
      </DropWrap>
    )
  } else {
    return null
  }
}
