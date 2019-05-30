import { action } from 'overmind'
import { Operator } from '../app'
import { getTitleElem } from '../lib/getTitle'
import { InputChangeArgs, TitleChangeArgs } from '../lib/utils/types'

export const inputChange: Operator<InputChangeArgs> = action((ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  editor.clearToolbox(value.holder)
  editor.changeText(ctx, value)
  editor.changed(value.holder)
})

export const titleChange: Operator<TitleChangeArgs> = action((ctx, arg) => {
  const { editor } = ctx.effects
  const { holder, value } = arg
  editor.ensureComposition(holder)
  editor.clearToolbox(holder)
  const { composition } = holder
  const elem = getTitleElem(composition!)
  if (elem) {
    elem.i = value
    editor.clearSelection(holder)
    editor.changed(holder)
  }
})
