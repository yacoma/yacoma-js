import { action } from 'overmind'
import { Operator } from '../app'

export const logout: Operator = action(async ctx => {
  await ctx.effects.data.logout(ctx)
  location.reload()
})
