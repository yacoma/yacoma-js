import * as React from 'react'
import styled from 'styled-components'

import { TStories } from '@lucidogen/story'

import { ThemeProvider as component, themeProxy } from '../..'
import { someTheme } from '../someTheme'

const theming = themeProxy(someTheme)

const Hello = styled.div`
  border: 1px solid ${theming.widgetBorderRadius};
  border-radius: ${theming.widgetBorderRadius};
  background: ${theming.widgetBackground};
  padding: ${theming.widgetPadding};
  color: ${theming.widgetColor};
`

const config = {
  state: {
    theme: {
      selectedTheme: someTheme,
    },
  },
}

export const themeProvider: TStories<typeof config, {}> = {
  name: 'ThemeProvider',
  config,
  component,
  titleClick: ({ state }) => {
    const theme = state.theme.selectedTheme
    theme.widgetColor = theme.widgetColor === '#f589d9' ? '#89f5c3' : '#f589d9'
  },
  stories: [
    {
      name: 'simple',
      children: <Hello>Hello World</Hello>,
    },
  ],
}
