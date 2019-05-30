import { action } from 'overmind'
import { Operator } from '../app'

export const addAttachment: Operator<{
  id: string
  targetId: string
}> = action((ctx, value) => {
  ctx.effects.chat.addAttachment(ctx, value)
})
