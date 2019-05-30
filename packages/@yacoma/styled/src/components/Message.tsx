import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'

// import { Markdown } from 'styled/Markdown'

const GrowDiv = styled.div`
  flex-grow: 1;
`

const TheIcon = styled(Icon)`
  margin-left: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export interface MessageProps {
  className?: string
  icon?: string | boolean
  replace?: { [key: string]: string }
  spin?: boolean
  // Text (not translated).
  text?: string
  // Text (translated).
  textKey?: string
}

function replaceWords(text: string, words?: { [key: string]: string }) {
  if (!words) {
    return text
  }
  return Object.keys(words).reduce(
    (text, word) => text.replace(new RegExp(word, 'g'), words[word]),
    text
  )
}

const MessageComponent: Comp<MessageProps> = ({
  children,
  className,
  icon,
  replace,
  spin,
  text,
  textKey,
}) => {
  const { state } = useOvermind()
  const translate = state.locale.translate
  const baseText = textKey ? translate(textKey) : text
  const theText = baseText ? replaceWords(baseText, replace) : null
  return (
    <Wrapper className={classnames({}, className)}>
      <GrowDiv>
        {typeof icon === 'string' ? (
          <TheIcon spin={spin} icon={icon} />
        ) : icon && text ? (
          <TheIcon spin={spin} icon={text} />
        ) : null}
        {theText}
        {children}
      </GrowDiv>
    </Wrapper>
  )
}

export const Text = MessageComponent

export const Message = styled(MessageComponent)`
  text-align: left;
  margin: ${theme.messageMargin};
  margin-bottom: 0;
`
