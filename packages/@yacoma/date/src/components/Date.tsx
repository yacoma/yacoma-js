import moment from 'moment'
import * as React from 'react'
import { Comp } from '../app'

export interface DateProps extends React.HTMLProps<HTMLSpanElement> {
  className?: string
  date: string | number
  format?: string
}

export const Date: Comp<DateProps> = ({
  className,
  date,
  format,
  ...props
}) => (
  <span className={className} {...props}>
    {moment(date).format(format || 'LLL')}
  </span>
)
