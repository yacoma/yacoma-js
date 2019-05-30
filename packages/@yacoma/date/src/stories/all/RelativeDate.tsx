import { TStories } from '@lucidogen/story'
import { action } from 'overmind'
import * as React from 'react'
import { RelativeDate } from '../../'
import { Comp, styled } from '../../app'
import { RelativeDateProps as Props } from '../../components'
import { config, makeDateStories, useOvermind } from '../helper'

const component = styled(RelativeDate)`
  @keyframes getReady {
    /* 10 days before */
    100% {
      background: #6ecc92;
    }
    /* 5 days before */
    50% {
      background: orange;
    }
    /* on the day or after */
    0% {
      background: red;
    }
  }

  @keyframes overdueDate {
    /* 10 days overdue */
    100% {
      background: red;
    }
    /* on the day */
    0% {
      background: yellow;
    }
  }

  &.In.Days {
    animation-name: getReady;
  }
  &.Ago.Days {
    animation-name: overdueDate;
  }
`

const agoStyled = styled(component)`
  color: blue;
  &.In {
    color: green;
  }
`

const dueStyled = styled(component)`
  background: orange;
  padding: 5px 12px;
  border-radius: 5px;
  &.Ago {
    background: red;
  }
`

const wrapper: Comp = () => {
  const app = useOvermind()
  return (
    <div style={{ padding: '10px' }}>
      <RelativeDate date={app.state.test.date} />
    </div>
  )
}

export const ago: TStories<typeof config, Props> = {
  name: 'RelativeDate',
  config,
  component,
  stories: [
    ...makeDateStories(-1),
    ...makeDateStories(1),
    {
      name: 'click changes',
      wrapper,
      titleClick: action(({ state }) => {
        const delta = Date.now() - state.test.date
        state.test.date -= delta < 62000 ? 62000 : delta
      }),
      props: { date: Date.now() },
    },

    {
      name: 'ago styled',
      component: agoStyled,
      props: { date: Date.now() - 180000 },
    },

    {
      name: 'ago future',
      component: agoStyled,
      props: { date: Date.now() + 180000 },
    },

    {
      name: 'due styled',
      component: dueStyled,
      props: { date: Date.now() + 180000 },
    },

    {
      name: 'due past',
      component: dueStyled,
      props: { date: Date.now() - 180000 },
    },
  ],
}
