import * as React from 'react'
import { collectionTitle } from '@yacoma/data'
import {
  Button,
  CardContent,
  CardFooter,
  CardTitle,
  Horizontal,
  Message,
  Modal,
  Spacer,
} from '@yacoma/styled'
import { Comp, useOvermind } from '../app'

export interface ConfirmShareAttachmentProps {}

export const ConfirmMessage: Comp<ConfirmShareAttachmentProps> = () => {
  const ctx = useOvermind()

  const collectionId = ctx.state.document.selectedCollectionId
  if (!collectionId) {
    throw new Error(`Cannot show confirm share message without selected chat.`)
  }
  const { draft } = ctx.state.chat
  if (!draft) {
    // should never happen
    return null
  }
  const translate = ctx.state.locale.translate
  const attachments = draft.attachments
  const items = ctx.state.db.Item

  if (!attachments) {
    return null
  }
  const documents = Object.keys(attachments)
    .map(key => attachments[key].id)
    .filter(id => id)
    .map(id => items[id!])
    .filter(doc => doc)
    .map(doc => doc.title)
  if (!documents.length) {
    return null
  }
  const message = translate('ConfirmShare', 'Message')
    .replace('DOCUMENTS', documents.join("', '"))
    .replace('TITLE', collectionTitle(ctx, collectionId))
  return <Message>{message}</Message>
}

export const ConfirmShareAttachments: Comp = () => {
  const ctx = useOvermind()
  const collectionId = ctx.state.document.selectedCollectionId
  if (!collectionId) {
    throw new Error(`Cannot show confirm share message without selected chat.`)
  }
  return (
    <Modal>
      <CardTitle titleKey="ConfirmShare" />
      <CardContent>
        <ConfirmMessage />
        <Horizontal>
          <Spacer />
          <Button textKey="Cancel" onClick={() => ctx.actions.chat.clear()} />
          <Button
            primary
            textKey="Share"
            onClick={() => ctx.actions.chat.send({ collectionId })}
          />
        </Horizontal>
      </CardContent>
      <CardFooter />
    </Modal>
  )
}
