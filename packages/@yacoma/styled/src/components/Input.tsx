import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface InputProps
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    'form' | 'placeholder' | 'onChange' | 'ref' | 'as'
  > {
  // Styling
  className?: string
  // Do not allow edit.
  disabled?: boolean
  // Form. Example: state.forms.login
  form: { [key: string]: any }
  // Name of the field in the form
  name: string
  // If placeholder is true, we translate [name]Placeholder
  // and show this as placeholder
  placeholder?: string | boolean
  // Autofocus on mount
  autoFocus?: boolean
  // Show a reset button with input field to restore value to a blank string.
  reset?: boolean
  // Icon to show for the reset button (default to ResetField)
  resetIcon?: string
  // Action to do on reset (default to setting value to '')
  onReset?: () => void
  // Action to do on reset (default to setting value to '')
  onChange?: (arg: {
    form: { [key: string]: any }
    name: string
    value: any
  }) => void
  // Sequence Tag to trigger on enter. Example: sequences.auth.login
  submit?: () => void
  // Type for input element (password, etc).
  type?: string
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
`

const ResetIcon = styled(Icon)`
  position: absolute;
  right: 0.2rem;
  color: ${theme.inputResetColor};
  &:hover {
    color: ${theme.inputResetColorHover};
  }
`

const CheckIcon = styled(Icon)``

export const BaseInput: Comp<InputProps> = ({
  autoFocus,
  className,
  disabled,
  form,
  name,
  onChange: changeCallback,
  onReset,
  placeholder,
  reset,
  resetIcon,
  submit,
  type,
  ...props
}) => {
  const app = useOvermind()
  const changed = changeCallback || app.actions.styled.valueChanged
  const translate = app.state.locale.translate

  const placeholderName =
    placeholder === true ? `${name}Placeholder` : placeholder
  const value = form[name]

  // istanbul ignore next
  function onChange(e: React.FormEvent<HTMLInputElement>) {
    changed({
      value: e.currentTarget.value,
      form,
      name,
    })
  }

  // istanbul ignore next
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (submit && e.key === 'Enter') {
      submit()
    } else if (e.key === 'Escape') {
      changed({
        value: '',
        form,
        name,
      })
    }
  }
  if (type === 'checkbox') {
    const value = form[name]
    return (
      <span
        className={classnames(className, 'Checkbox', {
          checked: !!value,
          disabled,
        })}
        onClick={
          // istanbul ignore next
          disabled ? undefined : () => changed({ form, name, value: !value })
        }
      >
        <CheckIcon icon={value ? 'CheckboxOn' : 'CheckboxOff'} />
        <span className="text">
          {app.state.locale.translate(`${name}Checkbox`)}
        </span>
      </span>
    )
  }

  const field = (
    <input
      autoComplete="off"
      autoFocus={autoFocus}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholderName ? translate(placeholderName) : ''}
      type={type}
      value={value || ''}
      {...props}
    />
  )

  return (
    <Wrapper className={classnames(className, { reset })}>
      {field}
      {reset && value ? (
        <ResetIcon
          className="reset"
          icon={resetIcon || 'ResetField'}
          onClick={
            // istanbul ignore next
            onReset || (() => changed({ form, name, value: '' }))
          }
        />
      ) : null}
    </Wrapper>
  )
}

// .nobg is needed to avoid ugly corners in Field with
// borderRadius.
// flex-box bug on windows without width: 0
export const Input = styled(BaseInput)`
  & input {
    background: ${theme.inputBackground};
    border: none;
    color: ${theme.inputColor};
    display: flex;
    flex-grow: 1;
    font-size: ${theme.inputFontSize};
    line-height: ${theme.inputLineHeight};
    padding: ${theme.inputPadding};
    width: 0;
  }
  &.reset input {
    padding-right: 1.5rem;
  }
  & input:focus {
    outline: none;
  }
  & input::placeholder {
    color: ${theme.inputPlaceholderColor};
  }
  &.nobg input {
    background: transparent;
  }
  &.Checkbox:not(.disabled) {
    cursor: pointer;
  }
  &.Checkbox {
    line-height: normal;
    display: flex;
    align-items: center;
  }
  &.Checkbox .text {
    margin: ${theme.iconMargin};
    margin-left: 0;
    font-weight: bold;
  }
`

export const RoundInput = styled(Input)`
  & input {
    flex-grow: 1;
    border-radius: ${theme.roundInputBorderRadius};
    padding: ${theme.roundInputPadding};
    background: ${theme.roundInputBackground};
  }
  & .reset {
    top: ${theme.roundInputResetTop};
    right: ${theme.roundInputResetRight};
    color: ${theme.roundInputResetColor};
  }
  &.light input {
    background: ${theme.roundInputLightBackground};
  }
`

RoundInput.displayName = 'RoundInput'
