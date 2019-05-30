import { ContactPrint as component, ContactPrintProps as Props } from '../..'
import { config, Stories, wordList } from '../helper'

export const contactPrint: Stories<Props> = {
  name: 'ContactPrint',
  config,
  stories: [
    {
      name: 'simple',
      component,
      state: {
        data: {
          login: {
            username: 'Lily',
            email: 'lily@loves.you',
            wordList,
          },
        },
      },
    },
  ],
}
