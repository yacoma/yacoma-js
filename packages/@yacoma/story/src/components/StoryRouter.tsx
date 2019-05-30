import * as React from 'react'
import { Comp, styled } from '../app'
import { Stories } from '../types'
import { StoryGroup } from './StoryGroup'

interface StoryRouterProps {
  className?: string
  stories: Stories[]
}

const StoryRouterComp: Comp<StoryRouterProps> = ({ className, stories }) => (
  <div className={className}>
    {stories.map((group, idx) => (
      <StoryGroup key={idx} stories={group} />
    ))}
  </div>
)

export const StoryRouter = styled(StoryRouterComp)`
  display: flex;
  flex-direction: column;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, monospace;
`
