import { Operator } from '../app'
import { action } from 'overmind'

export const login: Operator = action(async ctx => {
  const { state, effects } = ctx
  const { data } = effects
  delete ctx.state.data.login.error
  const result = await data.login(ctx)
  if (result === 'offline') {
    state.data.login.error = 'Offline'
  } else if (result) {
    data.loggedIn(ctx, result)
  } else {
    state.data.login.error = 'CouldNotLogin'
  }
})
