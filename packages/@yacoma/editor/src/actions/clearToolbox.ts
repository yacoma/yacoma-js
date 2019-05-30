import { action } from 'overmind'
import { Operator } from '../app'
import { CompositionArgs } from '../lib/utils/types'

export const clearToolbox: Operator<CompositionArgs> = action((ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  editor.clearToolbox(value.holder)
})
