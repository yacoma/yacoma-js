import { action, Overmind } from 'overmind'
import { Config, Operator } from './app'
import { updateLocale } from './helpers'

export const onInitialize: Operator<Overmind<Config>> = action((ctx, app) => {
  const { effects, state } = ctx
  const updateNow = app.actions.date.updateNow
  let callback: any
  // Create a new object on init to make sure we do not
  // share `date` effect with other contexts (testing).
  effects.date = {
    restart(interval: number) {
      if (callback) {
        clearInterval(callback)
        callback = undefined
      }
      if (interval) {
        callback = setInterval(updateNow, interval * 1000)
      }
    },
  }

  app.addMutationListener(({ path, args }) => {
    if (path.startsWith('date.nowInterval')) {
      effects.date.restart(state.date.nowInterval)
    } else if (path.startsWith('locale.lang')) {
      updateLocale(args[0])
    }
  })

  updateLocale(state.locale.lang)
  effects.date.restart(state.date.nowInterval)
})
