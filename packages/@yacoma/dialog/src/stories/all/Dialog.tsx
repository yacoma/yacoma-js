import { action } from 'overmind'
import * as React from 'react'
import { build, settings } from '@yacoma/build'
import { TStories } from '@yacoma/story'
import { Dialog as component, dialog, DialogProps } from '../..'
import { DialogSettings } from '../../types'

const main = {
  name: 'main',
  settings: settings<DialogSettings>({
    dialog: {
      exclusive: {
        Exclusive: ({ children }) => <div>Exclusive: {children}</div>,
      },
      overlay: {
        Overlay: ({ children }) => <div>Overlay: {children}</div>,
      },
    },
  }),
}
const config = build(main)
  .using(dialog)
  .config()

export const modalStories: TStories<typeof config, DialogProps> = {
  component,
  config,
  name: 'Dialog (click to view)',
  stories: [
    {
      name: 'exclusive',
      props: {},
      titleClick: action(({ state }) => {
        if (state.dialog.show === 'Exclusive') {
          delete state.dialog.show
        } else {
          state.dialog.show = 'Exclusive'
        }
      }),
      children: <div>this is inside Dialog children</div>,
    },

    {
      name: 'overlay',
      props: {},
      titleClick: action(({ state }) => {
        if (state.dialog.show === 'Overlay') {
          delete state.dialog.show
        } else {
          state.dialog.show = 'Overlay'
        }
      }),
      children: <div>this is inside Dialog children</div>,
    },
  ],
}
