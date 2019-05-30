import { Select as component, SelectProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const selectStories: Stories<Props> = {
  name: 'Select',
  component,
  config,
  stories: [
    {
      name: 'options',
      fprops: ({ state }) => ({
        form: state.test,
        name: 'lang',
        options: [
          { key: 'ru', value: 'русский' },
          { key: 'fr', value: 'français' },
          { key: 'hin', value: 'हिंदी' },
        ],
      }),
    },

    {
      name: 'keys',
      fprops: ({ state }) => ({
        form: state.test,
        name: 'lang',
        keys: ['ru', 'fr', 'hin'],
      }),
    },
  ],
}
