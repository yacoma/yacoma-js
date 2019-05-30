import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  className?: string
  // The icon string to translate before passing it to
  // the actual icon rendering function.
  icon: string
  // If the value is trueish, the icon is higlighted (.highlighted class set).
  highlighted?: (() => any) | boolean
  // If true, the icon is 50% transparent and click is disabled.
  disabled?: boolean
  // If true will use icon name with 'On' appended when highlighted.
  // For example 'Folder', 'FolderOn', etc.
  hasOn?: boolean
  // Click handler when not using sequence.
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  // Used by controls to show that the value has been edited.
  changed?: boolean
  // Simple styling for large/medium variants. This should use theme.
  large?: boolean
  medium?: boolean
  // Fontawesome
  style?: any
  fixedWidth?: boolean
  spin?: boolean
}

const IconComp: Comp<IconProps> = ({
  children,
  className,
  disabled,
  fixedWidth,
  hasOn,
  highlighted,
  icon,
  large,
  medium,
  onClick,
  spin,
  style,
  ...props
}) => {
  const { state } = useOvermind()
  const { IconComponent, icons } = state.styled.iconProvider()
  const isHigh =
    highlighted !== undefined && typeof highlighted === 'function'
      ? highlighted()
      : highlighted
  const iconName = hasOn && isHigh ? icon + 'On' : icon
  const click =
    onClick && !disabled
      ? (e: React.MouseEvent<HTMLSpanElement>) => {
          // We cannot preventDefault in case the caller forwards the
          // click (like on a input[type=file])
          e.stopPropagation()
          onClick(e)
        }
      : undefined
  return (
    <IconComponent
      fixedWidth={fixedWidth}
      spin={spin}
      icon={iconName}
      icons={icons}
      className={classnames(
        {
          highlighted: isHigh,
          disabled,
          large,
          medium,
          hasClick: (onClick && true) || false,
        },
        'Icon',
        className
      )}
      onClick={click}
      style={style}
      {...props}
    >
      {children}
    </IconComponent>
  )
}

export const Icon = styled(IconComp)`
  position: relative;
  margin: ${theme.iconMargin};
  width: 1rem;
  height: 1rem;
  &.large {
    font-size: ${theme.iconLargeFontSize};
    margin: ${theme.iconLargeMargin};
    width: ${theme.iconLargeFontSize};
    height: ${theme.iconLargeFontSize};
  }
  &.medium {
    font-size: ${theme.iconMediumFontSize};
    margin: ${theme.iconMediumMargin};
    width: ${theme.iconMediumFontSize};
  }
  &.hasClick {
    cursor: pointer;
    &:active {
      transform: translateY(0.5px);
      transition-duration: 0.1s;
    }
  }
  &.disabled {
    opacity: ${theme.iconDisabledOpacity};
  }
`
