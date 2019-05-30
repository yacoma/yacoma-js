import { Inspector as component, InspectorProps as Props } from '../..'
import { config, Stories } from '../helpers'
import { action } from 'overmind'

export const inspector: Stories<Props> = {
  name: 'Inspector',
  component,
  config,
  stories: [
    {
      titleClick: action(({ state }) => {
        state.test.hasDocument = !state.test.hasDocument
      }),
      name: 'inspector',
    },
  ],
}
