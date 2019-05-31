import { Overmind } from 'overmind'
import * as React from 'react'
import { Stories } from '@yacoma/story'
import { Toolbox as component, ToolboxProps as Props } from '../..'
import { config, Config } from '../helpers'

const wrapper = ({ children }: any) => (
  <div
    style={{
      position: 'relative',
      width: '400px',
      height: '110px',
      background: 'white',
    }}
    id="toolbox1"
  >
    {children}
  </div>
)

export const toolboxStories: Stories<Props> = {
  name: 'Toolbox',
  component,
  config,
  wrapper,
  stories: [
    {
      name: 'selection',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.t1, compId: 't1' }
      },
    },
    {
      name: 'paragraph',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.t2, compId: 't2' }
      },
    },
    {
      name: 'emptyParagraph',
      fprops(app: Overmind<Config>) {
        return { holder: app.state.test.t3, compId: 't3' }
      },
    },
  ],
}
