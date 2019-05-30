import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as React from 'react'
import { Comp } from '../app'
import { IconComponentProps } from '../types'

export const FaIconComponent: Comp<IconComponentProps> = ({
  icon,
  icons,
  children,
  className,
  fixedWidth,
  spin,
  ...props
}) => {
  const theIcon = icons[icon]
  if (!theIcon) {
    throw new Error(`Missing icon '${icon}'.`)
  }
  return (
    <span className={className} {...props}>
      <FontAwesomeIcon icon={theIcon} fixedWidth={fixedWidth} spin={spin} />
      {children}
    </span>
  )
}
