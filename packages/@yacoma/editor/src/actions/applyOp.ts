import { action } from 'overmind'
import { Operator } from '../app'
import { ApplyOpArgs } from '../lib/utils/types'

export const applyOp: Operator<ApplyOpArgs> = action((ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  const ops = editor.handleOp(ctx, value)
  editor.processOps(ops)
  editor.changed(value.holder)
})
