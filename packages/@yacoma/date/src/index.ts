import { Block, settings } from '@yacoma/build'
import { locale, LocaleSettings } from '@yacoma/locale'
import { styled, StyledSettings } from '@yacoma/styled'
import { theme, ThemeSettings } from '@yacoma/theme'
import * as actions from './actions'
import { icons } from './icons'
import { onInitialize } from './onInitialize'
import { dateTheme } from './theme'
import { DateConfig } from './types'

export * from './components'
export * from './theme'
export * from './types'

const DEFAULT_INTERVAL = 15
const DEFAULT_WEEK_DAY_START = 1

export const date: Block<DateConfig> = {
  name: 'date',
  dependencies: [locale, theme, styled],
  onInitialize,
  settings: settings<ThemeSettings & LocaleSettings & StyledSettings>({
    locale: {
      en: {
        JustNowDate: 'just now',
        In1Minute: 'in 1 minute',
        InXMinutes: 'in {count} minutes',
        In1Hour: 'in 1 hour',
        InXHours: 'in {count} hours',
        In1Day: 'in 1 day',
        InXDays: 'in {count} days',
        Ago1Minute: '1 minute ago',
        AgoXMinutes: '{count} minutes ago',
        Ago1Hour: '1 hour ago',
        AgoXHours: '{count} hours ago',
        Ago1Day: '1 day ago',
        AgoXDays: '{count} days ago',

        JustNow: 'just now',
        Date: 'Date',
        Hours: 'Hours',
        Minutes: 'Minutes',
        Time: 'Time',
        CalDay0: 'Sun',
        CalDay1: 'Mon',
        CalDay2: 'Tue',
        CalDay3: 'Wed',
        CalDay4: 'Thu',
        CalDay5: 'Fri',
        CalDay6: 'Sat',
      },
    },
    styled: {
      icons,
    },
    theme: {
      default: dateTheme,
    },
  }),
  state: {
    date: {
      now: Date.now(),
      nowInterval: DEFAULT_INTERVAL,
      weekDayStart: DEFAULT_WEEK_DAY_START,
    },
  },
  actions: {
    date: actions,
  },
  effects: {
    date: {
      restart() {},
    },
  },
}
