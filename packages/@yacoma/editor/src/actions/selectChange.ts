import { action } from 'overmind'
import { Operator } from '../app'
import { SelectChangeArgs } from '../lib/utils/types'

export const selectChange: Operator<SelectChangeArgs> = action((ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  const ops = editor.handleSelect(value)
  editor.processOps(ops)
})
