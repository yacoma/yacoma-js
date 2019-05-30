import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface SelectProps {
  // Styling
  className?: string
  // State tag to form value
  form: { [key: string]: any }
  // The key of the value in form
  name: string
  // A method to trigger on value change instead of directly
  // changing state value.
  onChange?: (key: string) => void
  // Array of keys to be used as options, the keys are translated.
  keys?: string[]
  // Direct key/value pairs.
  options?: { key: string; value: string }[]
  // Open select on mount
  autoFocus?: boolean
  // When value is selected: show key instead of value
  showKey?: boolean
}

const Wrapper = styled.div`
  user-select: none;
  cursor: pointer;
  position: relative;
`

const OptionList = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: ${theme.cardColor};
  background: ${theme.cardBackground};
  border-radius: ${theme.cardBorderRadius};
  border: ${theme.cardBorder};
  box-shadow: ${theme.cardBoxShadow};
  z-index: 99;
  &.moved .selected {
    color: ${theme.optionColor};
    background: ${theme.optionBackground};
  }
  &.moved .selected:hover {
    color: ${theme.optionHoverColor};
    background: ${theme.optionHoverBackground};
  }
`

export const Option = styled.div`
  user-select: none;
  padding: ${theme.optionPadding};
  color: ${theme.optionColor};
  background: ${theme.optionBackground};
  &.selected {
    color: ${theme.optionSelectedColor};
    background: ${theme.optionSelectedBackground};
  }
  &:hover {
    color: ${theme.optionHoverColor};
    background: ${theme.optionHoverBackground};
  }
`

export const Select: Comp<SelectProps> = ({
  autoFocus,
  className,
  form,
  keys,
  name,
  options: theOptions,
  onChange,
  showKey,
}) => {
  const ctx = useOvermind()
  const [open, setOpen] = React.useState(!!autoFocus)
  const [moved, setMoved] = React.useState(false)
  const translate = ctx.state.locale.translate
  const selected = form[name]
  const options =
    theOptions ||
    (keys ? keys.map(key => ({ key, value: translate(key) })) : undefined)

  if (!options) {
    throw new Error(
      `Invalid Select props. You need one of 'keys' or 'options'.`
    )
  }

  const value = showKey
    ? selected
    : (options.find(opt => opt.key === selected) || options[0]).value

  if (open) {
    return (
      <Wrapper className={className}>
        {value}
        <OptionList
          className={moved ? 'moved' : ''}
          onMouseMove={() => setMoved(true)}
          onMouseLeave={() => setMoved(false)}
        >
          {options.map(opt => (
            <Option
              key={opt.key}
              className={opt.key === selected ? 'selected' : ''}
              onMouseUp={() => {
                if (!moved) {
                  setMoved(true)
                  return
                }
                if (onChange) {
                  onChange(opt.key)
                } else {
                  ctx.actions.styled.valueChanged({
                    form,
                    name,
                    value: opt.key,
                  })
                }
                setOpen(false)
                setMoved(false)
              }}
            >
              {opt.value}
            </Option>
          ))}
        </OptionList>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper className={className} onMouseDown={() => setOpen(true)}>
        {value}
      </Wrapper>
    )
  }
}
