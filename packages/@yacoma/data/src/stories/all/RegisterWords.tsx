import {
  RegisterWordsCard as component,
  RegisterWordsCardProps as Props,
} from '../..'
import { config, Stories, wordList } from '../helper'

export const registerWords: Stories<Props> = {
  name: 'RegisterWords',
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
