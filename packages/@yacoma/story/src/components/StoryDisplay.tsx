import { IConfiguration, IOperator, Overmind } from 'overmind'
import { Provider } from 'overmind-react'
import * as React from 'react'
import { DirectThemeProvider, themeProxy } from '@yacoma/theme'
import { Comp, styled, useOvermind } from '../app'
import { storyTheme } from '../theme'
import { Stories, Story } from '../types'
import { ComponentCode } from './ComponentCode'
import { Title } from './Title'

const theme = themeProxy(storyTheme)

export const ComponentWrapper = styled.div`
  align-self: end;
  margin: ${theme.storyGridSize};
  background: white;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-size: calc(1 * ${theme.storyGridSize})
    calc(1 * ${theme.storyGridSize});
  background-position: calc(1 * ${theme.storyGridSize})
    calc(1 * ${theme.storyGridSize});
  background-image: linear-gradient(
      to right,
      ${theme.storyGridColor} 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      ${theme.storyGridColor} 1px,
      ${theme.storyGridBackground} 1px
    );
`

const ColWrap = styled.div`
  display: flex;
  flex-direction: column;
`

export interface StoryDisplayProps {
  className?: string
  story: Story
  stories: Stories
}

const Display: Comp<{ getProps: any; Component: any }> = ({
  children,
  getProps,
  Component,
}) => {
  const app = useOvermind()
  const props = getProps(app)
  return <Component {...props}>{children}</Component>
}

function deepMerge(
  target: { [key: string]: any },
  source: { [key: string]: any },
  keys: string[] = []
) {
  Object.keys(source).forEach(key => {
    const value = source[key]
    if (Array.isArray(value)) {
      target[key] = value
    } else if (value === null) {
      delete target[key]
    } else if (typeof value === 'object') {
      target[key] =
        target[key] === undefined ? {} : Object.assign({}, target[key])
      if (typeof target[key] === 'object') {
        deepMerge(target[key], value, [...keys, key])
      } else {
        throw new Error(
          `Cannot merge object in '${[...keys, key].join(
            '.'
          )}: target is not an object.'`
        )
      }
    } else if (typeof target[key] === 'object') {
      throw new Error(
        `Cannot merge ${typeof value} in '${[...keys, key].join(
          '.'
        )}: target is an object.'`
      )
    } else {
      target[key] = source[key]
    }
  })
}

function StoryDisplayComp({ className, story, stories }: StoryDisplayProps) {
  function getProps(app: any) {
    const props = stories.props || {}
    const sprops = story.props || {}
    return Object.assign(
      {},
      typeof props === 'function' ? props(app) : props,
      typeof sprops === 'function' ? sprops(app) : sprops
    )
  }
  const Comp = story.component || stories.component
  if (!Comp) {
    throw new Error(
      `Invalid story '${story.name}' in '${stories.name}': missing component.`
    )
  }

  const appState = Object.assign(
    {},
    (story.config || stories.config || {}).state || ({} as any)
  )
  if (stories.state) {
    deepMerge(appState, stories.state)
  }
  if (story.state) {
    deepMerge(appState, story.state)
  }

  const config: IConfiguration & {
    actions: { _titleClick?: IOperator<any, any, any> }
    state: {
      theme?: any
    }
  } = Object.assign(
    {
      actions: {},
    },
    story.config || stories.config || {},
    {
      state: appState,
    }
  )

  const titleClick = story.titleClick || stories.titleClick
  if (titleClick) {
    config.actions = Object.assign({}, config.actions, {
      _titleClick: titleClick,
    })
  }

  const name = `${stories.name}.${story.name}`

  const overmind = new Overmind(config, {
    name,
    devtools: story.devtools,
  })

  const CompWrap = story.wrapper || stories.wrapper || ComponentWrapper

  const TheChildren = story.children || stories.children || null
  let children = TheChildren
  if (TheChildren && typeof TheChildren === 'function') {
    children = <TheChildren />
  }
  const mtheme = overmind.state.theme
    ? overmind.state.theme.selectedTheme
    : undefined
  const theme = Object.assign(
    {},
    mtheme || {},
    storyTheme,
    stories.theme || {},
    story.theme || {}
  )
  const scopeName = `${stories.name}-${story.name}`.replace(/[^a-zA-Z]/g, '-')
  return (
    <DirectThemeProvider scopeName={scopeName} theme={theme}>
      <Provider value={overmind}>
        <div className={className}>
          <Wrapper>
            <ColWrap>
              <Title onClick={overmind.actions._titleClick}>{story.name}</Title>
              <ComponentCode
                component={Comp}
                children={children}
                props={getProps}
                jsx={story.jsx}
              />
            </ColWrap>
            <CompWrap>
              <Display
                Component={Comp}
                getProps={getProps}
                children={children}
              />
            </CompWrap>
          </Wrapper>
        </div>
      </Provider>
    </DirectThemeProvider>
  )
}

export const StoryDisplay = styled(StoryDisplayComp)`
  border: 1px solid #aaa;
  margin: 10px;
  display: flex;
  flex-direction: column;
`
