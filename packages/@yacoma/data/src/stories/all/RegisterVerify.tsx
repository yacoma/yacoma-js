import {
  RegisterVerifyCard as component,
  RegisterVerifyCardProps as Props,
} from '../..'
import { config, Stories, wordList } from '../helper'

export const registerVerify: Stories<Props> = {
  name: 'RegisterVerify',
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
            wordListVerify: wordList.slice(0, 11),
            wordList,
          },
        },
      },
    },
  ],
}
