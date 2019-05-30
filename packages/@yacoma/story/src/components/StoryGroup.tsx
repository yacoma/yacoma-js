import * as React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Comp } from '../app'
import { Stories } from '../types'
import { StoryDisplay } from './StoryDisplay'

const GroupTitle = styled.div`
  padding: 10px;
  cursor: pointer;
  user-select: none;
`

const GroupStories = styled.div``

interface StoryGroupProps {
  className?: string
  stories: Stories
}

const StoryGroupComp: Comp<StoryGroupProps> = ({ className, stories }) => {
  const [open, setOpen] = useState(true)

  /* istanbul ignore next */
  const style = { display: open ? 'block' : 'none' }
  return (
    <div className={className}>
      <GroupTitle onClick={/* istanbul ignore next */ () => setOpen(!open)}>
        {stories.name}
      </GroupTitle>
      <GroupStories style={style}>
        {stories.stories.map((story, idx) => (
          <StoryDisplay key={idx} story={story} stories={stories} />
        ))}
      </GroupStories>
    </div>
  )
}

export const StoryGroup = styled(StoryGroupComp)`
  border-left: 3px solid #eee;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`
