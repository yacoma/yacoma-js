import { Icon as component, IconProps as Props } from '../..'
import { config, Stories } from '../helpers'
import { action } from 'overmind'

export const iconStories: Stories<Props> = {
  name: 'Icon FontAwesome',
  component,
  config,
  stories: [
    {
      name: 'simple',
      props: { icon: 'user' },
    },

    {
      name: 'medium',
      props: { icon: 'user', medium: true },
    },

    {
      name: 'large',
      props: { icon: 'user', large: true },
    },

    {
      name: 'hasOn',
      titleClick: action(({ state }) => (state.test.open = !state.test.open)),
      fprops: ({ state }) => ({
        // component is not really created: props only used to display
        icon: 'folder',
        hasOn: true,
        highlighted: state.test.open,
        onClick() {
          alert('Click on title')
        },
      }),
    },

    {
      name: 'hasOn is on',
      titleClick: action(({ state }) => (state.test.open = !state.test.open)),
      fprops: ({ state }) => ({
        // component is not really created: props only used to display
        icon: 'folder',
        hasOn: true,
        highlighted: state.test.open,
        onClick() {
          alert('Click on title')
        },
      }),
      state: {
        test: {
          open: true,
        },
      },
    },
  ],
}
