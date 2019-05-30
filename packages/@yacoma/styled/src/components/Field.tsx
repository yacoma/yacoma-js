import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'
import { Input, InputProps } from './Input'

const FieldIcon = styled.div`
  display: flex;
  align-items: center;
  border-top-left-radius: ${theme.fieldBorderRadius};
  border-bottom-left-radius: ${theme.fieldBorderRadius};
  background: ${theme.fieldIconBackground};
  justify-content: center;
  border-right: ${theme.fieldBorder};
  line-height: ${theme.inputLineHeight};
  padding: 0.1rem;
`

const TheIcon = styled(Icon)`
  font-size: ${theme.inputFontSize};
  line-height: ${theme.inputLineHeight};
  padding: ${theme.fieldIconPadding};
`

const TheInput = styled(Input)`
  & input {
    flex: 1;
  }
`

export interface FieldProps extends InputProps {
  // Display an icon with the given name
  icon?: string | boolean
}

const FieldComponent: Comp<FieldProps> = ({ icon, className, ...props }) => {
  // Track
  useOvermind()

  let iconName = ''
  if (icon === true) {
    iconName = props.name
  } else if (icon) {
    iconName = icon
  }

  return (
    <div
      className={classnames(className, {
        Checkbox: props.type === 'checkbox',
        hasValue: !!props.form[props.name],
      })}
    >
      {icon && (
        <FieldIcon>
          <TheIcon icon={iconName} />
        </FieldIcon>
      )}
      <TheInput {...props} className="nobg" />
    </div>
  )
}

export const Field = styled(FieldComponent)`
  display: flex;
  flex-grow: 1;
  margin: ${theme.fieldMargin};
  margin-bottom: 0;
  border: ${theme.fieldBorder};
  border-radius: ${theme.fieldBorderRadius};
  box-sizing: border-box;
  background: ${theme.inputBackground};
  line-height: ${theme.inputLineHeight};
  &.Checkbox {
    flex-grow: 0;
  }
  &.Checkbox.hasValue {
    background: ${theme.fieldCheckedBackground};
  }
`
