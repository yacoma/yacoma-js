import classnames from 'classnames'
import moment from 'moment'
import * as React from 'react'
import { Comp, useOvermind, styled } from '../app'
import { DATE_LIMITS } from '../helpers/dateLimits'

export interface RelativeDateProps extends React.HTMLProps<HTMLSpanElement> {
  className?: string
  gradient?: boolean
  date: string | number
  format?: string
}

// Just missing animation-name.
const Wrapper = styled.span`
  &.In {
    animation-play-state: paused;
    animation-delay: var(--deltaDays);
    animation-duration: 10s;
  }
  &.Ago {
    animation-play-state: paused;
    animation-delay: var(--deltaDays);
    animation-duration: 10s;
  }
`

export const RelativeDate: Comp<RelativeDateProps> = ({
  className,
  gradient,
  date: aDate,
  format,
  ...props
}) => {
  const app = useOvermind()
  const date = moment(aDate)
  const translate = app.state.locale.translate
  const now = app.state.date.now
  const nowDate = moment(now)
  let showDate: string
  let delta = now ? (now - date.valueOf()) / 1000 : Infinity
  let type: 'Ago' | 'In' = 'Ago'
  if (delta < 0) {
    delta = -delta
    type = 'In'
  }
  const limit = DATE_LIMITS(type).find(l => delta < l.limit)
  if (!limit) {
    showDate = date.format(format || 'LLL')
  } else if (limit.diff) {
    showDate = limit.fn(translate, Math.abs(nowDate.diff(date, limit.diff)))
  } else {
    showDate = limit.fn(translate, 0)
  }

  if (gradient) {
    // variable set to -10s (10 days before or after) to 0s
    const deltaDays = Math.min(0.0001, Math.max(-9.999, -delta / 3600 / 24))
    const style = Object.assign(
      {
        ['--deltaDays']: `${deltaDays}s`,
      },
      props.style || {}
    )
    return (
      <Wrapper
        className={classnames(className, type, 'Days')}
        {...props as any}
        style={style}
      >
        {showDate}
      </Wrapper>
    )
  } else {
    return (
      <Wrapper className={classnames(className, type)} {...props as any}>
        {showDate}
      </Wrapper>
    )
  }
}
