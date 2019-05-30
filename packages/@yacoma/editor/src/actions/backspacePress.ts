import { action } from 'overmind'
import { Operator } from '../app'
import { CompositionSelectionArgs } from '../lib/utils/types'

export const backspacePress: Operator<CompositionSelectionArgs> = action(
  (ctx, value) => {
    const { editor } = ctx.effects
    editor.ensureComposition(value.holder)
    // FIXME: deleteSelection should select previous para or
    // remove spath
    const ops = editor.deleteSelection(ctx, value)
    editor.processOps(ops)
    editor.changed(value.holder)
  }
)
