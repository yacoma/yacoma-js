import { action } from 'overmind'
import { Operator } from '../app'

export const removeAttachment: Operator<{ key: string }> = action(
  (ctx, value) => {
    const {
      effects: { chat },
    } = ctx
    chat.removeAttachment(ctx, value.key)
  }
)
