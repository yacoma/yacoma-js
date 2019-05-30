import { Block, settings } from '@lucidogen/build'
import { locale } from '@lucidogen/locale'
import { theme, ThemeSettings } from '@lucidogen/theme'
import * as actions from './actions'
import { FaIconComponent } from './components'
import { icons } from './icons'
import { setup } from './setup'
import { styledTheme } from './theme'
import { StyledConfig, StyledSettings } from './types'

export * from './components'
export * from './theme'
export * from './types'

export const styled: Block<StyledConfig> = {
  name: 'styled',
  setup,
  dependencies: [locale, theme],
  settings: settings<ThemeSettings & StyledSettings>({
    theme: {
      default: styledTheme,
    },
    styled: {
      icons,
    },
  }),
  state: {
    styled: {
      iconProvider: () => () => ({
        IconComponent: FaIconComponent,
        icons: {},
      }),
      // These are dummy value replaced
      familyComponents: null as any,
      show: {},
    },
  },
  actions: {
    styled: actions,
  },
}
