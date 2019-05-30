import { Block } from '@lucidogen/build'
import * as actions from './actions'
import { setup } from './setup'
import { translate } from './translate'
import { LocaleConfig } from './types'

export * from './types'

export const locale: Block<LocaleConfig> = {
  name: 'locale',
  setup,
  actions: {
    locale: actions,
  },
  state: {
    locale: {
      lang: 'en',
      locales: {
        en: {},
      },
      common: {},
      translate,
    },
  },
}
