import * as React from 'react'
// @ts-ignore
import * as renderer from 'react-test-renderer'

import { RenderOptions, StoriesDict } from './'
import { StoryDisplay } from './components/StoryDisplay'
import { Stories, Story } from './types'

declare var describe: any
declare var it: any
declare var expect: any

function testStory(stories: Stories, story: Story) {
  it(`should render ${story.name}`, () => {
    const tree = renderer
      .create(<StoryDisplay stories={stories} story={story} />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
}

export function testStories(
  opts: RenderOptions,
  ...storiesList: StoriesDict[]
) {
  const all: StoriesDict = Object.assign({}, ...storiesList)
  const list = [...Object.keys(all).map(key => all[key])]
  list.forEach(stories => {
    describe(stories.name, () => {
      stories.stories.forEach(story => {
        testStory(stories, story)
      })
    })
  })
}
