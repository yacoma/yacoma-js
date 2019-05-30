import { action } from 'overmind'
import { Operator } from '../app'
import { EnterPressArgs } from '../lib/utils/types'

export const enterPress: Operator<EnterPressArgs> = action((ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  const ops = editor.handleEnter(value)
  editor.processOps(ops)
  editor.changed(value.holder)
})
