import { Overmind } from 'overmind'
import * as React from 'react'
import styled from 'styled-components'
import { Stories } from '@yacoma/story'
import { Editor as component, EditorProps as Props } from '../..'
import { config, Config } from '../helpers'

const SomeChild = styled.div`
  border: 1px solid #333;
  background: #aaa;
  height: 80px;
  padding: 20px;
  color: #eee;
`

export const editorStories: Stories<Props> = {
  name: 'Editor',
  component,
  config,
  stories: [
    {
      name: 'with title',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.e1 }
      },
    },

    {
      name: 'with children',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.e1 }
      },
      children: [<SomeChild>This is a child</SomeChild>],
    },

    {
      name: 'no composition',
      fprops(app: Overmind<Config>) {
        return {
          holder: app.state.test.e5,
          titlePlaceholder: 'New Composition',
        }
      },
    },

    {
      name: 'no composition and no title',
      fprops(app: Overmind<Config>) {
        return {
          holder: app.state.test.e6,
          titlePlaceholder: 'New Composition',
        }
      },
    },

    {
      name: 'title true',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.e2 }
      },
    },

    {
      name: 'no title',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.e3 }
      },
    },

    {
      name: 'many pages',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.e4 }
      },
    },
  ],
}
