import { Explorer as component, ExplorerProps as Props } from '../../'
import { config, Stories } from '../helper'

export const explorer: Stories<Props> = {
  name: 'Explorer',
  config,
  component,
  stories: [
    {
      name: 'simple',
      props: {},
      state: {
        chat: {
          selected: null,
        },
      },
    },

    {
      name: 'selected files',
      props: {},
      state: {
        chat: {
          view: 'files',
        },
      },
    },

    {
      name: 'selected chat',
      props: {},
      state: {
        chat: {
          view: 'chat',
        },
      },
    },
  ],
}
