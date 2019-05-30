import { Translate } from '@lucidogen/locale'

export const DATE_LIMITS: (
  prefix: 'In' | 'Ago'
) => {
  limit: number
  diff?: 'minute' | 'hour' | 'day'
  fn: (translate: Translate, count: number) => string
}[] = prefix => [
  {
    limit: 60,
    fn(translate) {
      return translate('JustNow', 'Date')
    },
  },
  {
    // Less then 2 minutes
    limit: 120,
    fn(translate) {
      return translate(prefix + '1Minute')
    },
  },
  {
    // Less then 1 hours
    limit: 3600,
    diff: 'minute',
    fn(translate, minutes) {
      return translate(prefix + 'XMinutes').replace(
        '{count}',
        minutes.toString()
      )
    },
  },
  {
    // Less then 2 hours
    limit: 2 * 3600,
    fn(translate) {
      return translate(prefix + '1Hour')
    },
  },
  {
    // Les then 1 day
    limit: 24 * 3600,
    diff: 'hour',
    fn(translate, hours) {
      return translate(prefix + 'XHours').replace('{count}', hours.toString())
    },
  },
  {
    // Less then 1.5 days
    limit: 1.5 * 24 * 3600,
    fn(translate) {
      return translate(prefix + '1Day')
    },
  },
  {
    // Less then 20 days
    limit: 20 * 24 * 3600,
    diff: 'day',
    fn(translate, days) {
      return translate(prefix + 'XDays').replace('{count}', days.toString())
    },
  },
]
