import { action } from 'overmind'
import { Operator } from './app'

export const onInitialize: Operator<any, any> = action(async (ctx, app) => {
  const { data, dialog } = ctx.effects
  if (data.skipInit) {
    return
  }
  await data.registerCallbacks(ctx, app)
  const result = await data.autoLogin(ctx)

  if (result === 'offline') {
    dialog.show(ctx, 'Offline')
  } else if (result) {
    data.loggedIn(ctx, result)
  } else {
    dialog.show(ctx, 'Login')
  }
})
