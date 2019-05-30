import * as React from 'react'
import { describe, expect, it } from 'test'

import { build, settings } from '@lucidogen/build'

import { theme } from '../'
import { defaultTheme } from '../themes'
import { ThemeSettings } from '../types'
import {
  DirectThemeProvider as directThemeProvider,
  ThemeProvider as themeProvider,
} from './ThemeProvider'

const main = {
  name: 'main',
  settings: settings<ThemeSettings>({
    theme: {
      default: { thisWidth: '12px' },
    },
  }),
}

const app = build(main)
  .using(theme)
  .app()

describe('ThemeProvider', () => {
  it('should render children', () => {
    const connect = createConnect(app)
    const ThemeProvider = connect(themeProvider)
    // TODO: Should we mock `injectGlobal` from styled-components ?
    expect(
      testRender(<ThemeProvider scopeName="foo">foobar</ThemeProvider>)
    ).toMatchSnapshot()
  })
})

describe('DirectThemeProvider', () => {
  it('should render with provided theme', () => {
    const connect = createConnect(app)
    const DirectThemeProvider = connect(directThemeProvider)
    expect(
      testRender(
        <DirectThemeProvider scopeName="bar" theme={defaultTheme}>
          foobar
        </DirectThemeProvider>
      )
    ).toMatchSnapshot()
  })

  /*
  it('should render without connected', () => {
    const DirectThemeProvider = directThemeProvider
    expect(
      testRender(
        <DirectThemeProvider scopeName="bar" theme={defaultTheme}>
          foobar
        </DirectThemeProvider>
      )
    ).toMatchSnapshot()
  })
  */
})
