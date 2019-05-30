import { createHook } from 'overmind-react'
import { build, settings } from '@yacoma/build'
import { locale, LocaleSettings } from '@yacoma/locale'
import { theme, ThemeSettings } from '@yacoma/theme'
import { date, dateTheme } from '../'

export const config = build({
  name: 'test',
  settings: settings<ThemeSettings & LocaleSettings>({
    locale: {
      en: {
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
        PreviousMonthIcon: '<-',
        NextMonthIcon: '->',
      },
    },
    theme: {
      default: dateTheme,
    },
  }),
  state: {
    date: {
      weekDayStart: 1,
    },
    test: {
      date: Date.now(),
    },
  },
})
  .using(date)
  .using(locale)
  .using(theme)
  .config()

export const useOvermind = createHook<typeof config>()

const HOUR = 3600 * 1000

export function makeDateStories(plusMinus: number) {
  const type = plusMinus < 0 ? '+' : '-'
  return [
    {
      name: type + '1 minute',
      props: { date: Date.now() + plusMinus * 60000 },
    },

    {
      name: type + '2 minutes',
      props: { date: Date.now() + plusMinus * 120000 },
    },

    {
      name: type + '1 hour',
      props: { date: Date.now() + plusMinus * HOUR },
    },

    {
      name: type + '2 hours',
      props: { date: Date.now() + plusMinus * 2 * HOUR },
    },

    {
      name: type + '1 day',
      props: { date: Date.now() + plusMinus * 24 * HOUR, gradient: true },
    },

    {
      name: type + '3 day',
      props: {
        date: Date.now() + plusMinus * 3 * 24 * HOUR,
        gradient: true,
      },
    },

    {
      name: type + '6 day',
      props: {
        date: Date.now() + plusMinus * 6 * 24 * HOUR,
        gradient: true,
      },
    },

    {
      name: type + '9 day',
      props: {
        date: Date.now() + plusMinus * 9 * 24 * HOUR,
        gradient: true,
      },
    },

    {
      name: type + '10 day',
      props: {
        date: Date.now() + plusMinus * 10 * 24 * HOUR,
        gradient: true,
      },
    },

    {
      name: type + '11 day',
      props: {
        date: Date.now() + plusMinus * 11 * 24 * HOUR,
        gradient: true,
      },
    },

    {
      name: type + '19 days',
      props: { date: Date.now() + plusMinus * 20 * 24 * HOUR },
    },

    {
      name: type + '21 days',
      props: { date: Date.now() + plusMinus * 21 * 24 * HOUR },
    },

    {
      name: type + '2 minutes (string)',
      props: { date: new Date(Date.now() + plusMinus * 120000).toISOString() },
    },

    {
      name: type + 'now not set',
      props: { date: Date.now() + plusMinus * 43 * 3600 * 1000 },
      config: {
        state: {
          date: {
            now: null,
          },
          locale: {
            translate: () => () => 'Ho',
          },
        },
      } as any,
    },
  ]
}
