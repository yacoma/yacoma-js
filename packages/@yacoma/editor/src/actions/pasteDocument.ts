import { action } from 'overmind'
import { Operator } from '../app'
import {
  CompositionType,
  CompositionWrapper,
  PasteDocumentArgs,
} from '../lib/utils/types'

export function setDocument(args: PasteDocumentArgs) {
  const { holder, text } = args
  const { composition } = holder as CompositionWrapper
  try {
    const comp = JSON.parse(text)
    if (!comp.g) {
      throw new Error(`Bad text`)
    }
    Object.keys(comp).forEach(k => {
      const key = k as keyof CompositionType
      composition[key] = comp[key]
    })
  } catch (err) {
    console.warn(`Not a valid composition. Cannot paste.`)
    console.warn(text)
  }
}

// We cheat by adding `Ops` everywhere because `action` is buggy.
export const pasteDocument: Operator<PasteDocumentArgs> = action(
  (ctx, value) => {
    const { editor } = ctx.effects
    editor.ensureComposition(value.holder)
    setDocument(value)
    editor.changed(value.holder)
  }
)
