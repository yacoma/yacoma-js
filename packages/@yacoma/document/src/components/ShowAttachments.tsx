import { getItem, Message } from '@lucidogen/data'
import { Editor } from '@lucidogen/editor'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { Header } from './Header'

export interface ShowAttachmentsProps {
  className?: string
  width?: number
  message: Message
}

const Wrapper = styled.div``

export const ShowAttachments: Comp<ShowAttachmentsProps> = React.memo(
  ({ className, message }) => {
    const ctx = useOvermind()
    const attachments = message.attachments || {}
    const list = Object.keys(attachments).map((k, idx) => {
      const elem = attachments[k]
      const id = elem.id
      if (id) {
        const item = getItem(ctx, id)
        if (!item) {
          // Item not shared...
          return <div key={idx}>Missing item (not shared)...</div>
        } else {
          // TODO: not editable...
          return <Editor key={idx} holder={item} header={Header as any} />
        }
      }
      return null
    })

    return <Wrapper className={className}>{list}</Wrapper>
  }
)
