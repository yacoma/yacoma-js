import * as React from 'react'
import { getItem } from '@yacoma/data'
import { ToggleView } from '@yacoma/document'
import { Drop } from '@yacoma/dragdrop'
import { Horizontal, Icon } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { ChatState } from '../types'
import { Attachment } from './Attachment'
import { CollectionMessages } from './CollectionMessages'

export interface ChatProps {
  className?: string
  collectionId: string
}

export const Compose = styled.div`
  border-left: ${theme.cardItemBorder};
  border-top: ${theme.cardItemBorder};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 5px;
`

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 27px 8px;
`

const SendIcon = styled(Icon)`
  cursor: pointer;
  @keyframes SendPulse {
    0% {
      color: #ddd;
    }
    50% {
      color: orange;
    }
    100% {
      color: #ddd;
    }
  }
  &.highlighted {
    animation: SendPulse 2s alternate ease-in-out infinite;
  }
  align-self: center;
  width: ${theme.chatIconFontSize};
  font-size: ${theme.chatIconFontSize};
  color: ${theme.chatIconColor};
`

// We remove the drop border because it is ugly and
// displaces the elements.
export const DropWrap = styled(Drop)`
  border-top-width: 0;
  position: relative;
  width: 70%;
  border-width: 0;
  display: flex;
  flex-direction: column;
`

/*
const MessageInput = styled(RoundInput)`
  margin-right: 0.3rem;
  & input {
    background: ${theme.chatInputBackground};
  }
`
*/

const MessageInput = styled.textarea`
  flex-grow: 1;
  border-radius: ${theme.roundInputBorderRadius};
  padding: 6px 8px;
  height: 1.8rem;
  overflow: hidden;
  color: ${theme.inputColor};
  font-size: inherit;
  border: none;
  resize: none;
  &:focus {
    outline: none;
  }
  background: ${theme.inputBackground};
`

const ResetWrapper = styled.div`
  position: relative;
`

const ResetIcon = styled(Icon)`
  height: 1rem;
  position: absolute;
  left: -17px;
  top: 9px;
  font-size: 0.8rem;
  padding: 0;
  margin: 0;
  color: ${theme.inputResetColor};
  &:hover {
    color: ${theme.inputResetColorHover};
  }
`

export const Composer: Comp<{ className?: string; collectionId: string }> = ({
  className,
  collectionId,
}) => {
  const ctx = useOvermind()
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const [timer] = React.useState<{ timer?: any }>({})
  React.useEffect(() => {
    if (ref.current) {
      const o = ref.current
      o.style.height = '1px'
      o.style.height = o.scrollHeight + 'px'
    }
  })
  const { state, actions } = ctx

  const draft: ChatState['draft'] = state.chat.draft || {
    collectionId,
    attachments: {},
    title: '',
  }
  if (!draft || draft.collectionId !== collectionId) {
    // There is a message in progress somewhere. Do not display.
    return null
  }
  const draftAttachments = draft.attachments
  const attachments = draftAttachments
    ? Object.keys(draftAttachments).map(key => ({
        key,
        attach: draftAttachments[key],
      }))
    : []
  const form =
    (draft.previewId && getItem(ctx, draft.previewId, collectionId)) || draft
  return (
    <Compose className={className}>
      {attachments.length > 0 ? (
        <Attachments>
          {attachments.map(({ key, attach }) => (
            <Attachment
              key={key}
              collectionId={collectionId}
              {...attach}
              onRemove={() =>
                actions.chat.removeAttachment({
                  key,
                })
              }
            />
          ))}
        </Attachments>
      ) : null}
      <Horizontal>
        <MessageInput
          className="light"
          name="title"
          ref={ref as any}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (!e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                actions.chat.send({ collectionId, preview: e.altKey })
              }
            } else if (e.key === 'Escape') {
              e.preventDefault()
              e.stopPropagation()
              actions.chat.clear()
            }
          }}
          onChange={e => {
            ctx.actions.chat.inputChange({
              collectionId,
              value: e.target.value,
            })
          }}
          value={form.title}
        />
        {form.title && (
          <ResetWrapper>
            <ResetIcon onClick={() => actions.chat.clear()} icon="ResetField" />
          </ResetWrapper>
        )}
        <SendIcon
          highlighted={() => draft.title}
          icon="Send"
          onMouseDown={() => {
            timer.timer = setTimeout(() => {
              if (timer.timer) {
                clearTimeout(timer.timer)
                delete timer.timer
                actions.chat.send({ collectionId, preview: true })
              }
            }, 400)
          }}
          onMouseUp={() => {
            if (timer.timer) {
              clearTimeout(timer.timer)
              delete timer.timer
              actions.chat.send({ collectionId })
            }
          }}
        />
      </Horizontal>
    </Compose>
  )
}

export const Messages: Comp<ChatProps> = function Chat({
  className,
  collectionId,
}) {
  const ctx = useOvermind()

  return (
    <DropWrap
      className={className}
      drop={{ Item: true, Collection: true }}
      payload={{ targetId: collectionId }}
      onDrop={ctx.actions.chat.addAttachment}
    >
      <ToggleView />
      <CollectionMessages collectionId={collectionId} />
      <Composer collectionId={collectionId} />
    </DropWrap>
  )
}
