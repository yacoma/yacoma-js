import { Operator } from './app'

export interface DateConfig {
  state: {
    date: {
      // This value is updated every 15s. It is used to force a redraw of
      // components with date shown as `from now`.
      now: number
      // In [s]: how often `now` is updated. Defaults to 15 seconds.
      nowInterval: number
      // Starting day of the week for date picker or calendar
      // Defaults to (1 = Monday).
      weekDayStart: number
    }
  }

  actions: {
    date: {
      // This is run by a hook started on app boot.
      updateNow: Operator<void>
      // Change 'now' update interval (0 = stop updates).
      setInterval: Operator<number>
    }
  }

  effects: {
    date: {
      restart(interval: number): void
    }
  }
}
