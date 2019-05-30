import { Context } from '../app'
import { ChangesType, isStringElement } from '../lib'
import { stripZeroWidthChar } from '../lib/stripZeroWidthChar'
import { caretSelection } from '../lib/utils/caretSelection'
import { getSiblings } from '../lib/utils/getSiblings'
import { checkLast } from '../lib/utils/simplify'
import {
  CompositionWrapper,
  ElementType,
  InputChangeArgs,
} from '../lib/utils/types'
import { processSelect } from './processOps'

// FIXME: MERGE SOME OF THIS LOGIC INTO "makeOps ( simplify ( XXX ) )"
export function changeText(ctx: Context, props: InputChangeArgs) {
  const { state } = ctx
  const editor = state.editor.options()
  const { selection, value } = stripZeroWidthChar(
    props.value || '',
    props.selection
  )
  const { holder } = props
  const { composition } = holder as CompositionWrapper
  const elem = props.selection.anchorPath.reduce(
    (comp: ElementType, key) => {
      if (comp.g) {
        return comp.g[key]
      } else {
        throw new Error(
          `Invalid anchorPath: '${JSON.stringify(
            props.selection.anchorPath
          )}' (not group at '${key}').`
        )
      }
    },
    composition as ElementType
  )
  elem.i = value

  if (editor.getMarkup(value)) {
    const id = props.selection.anchorPath[0]
    // Check if element is last. If true ==> append empty text paragraph.
    const changes: ChangesType = { elements: {}, updated: [], selected: [] }
    checkLast(editor, composition, changes)
    if (changes.updated.length) {
      // New item appended
      const lastId = changes.updated[0]
      // Really not sure about this next line while migrating to overmind.
      // FIXME: make sure this works.
      // store.set(editor.compPath(id, [lastId]), changes.elements[lastId].elem)
      // This seems wrong. Fixing.
      // composition.g[id][lastId] = changes.elements[lastId].elem
      composition.g[lastId] = changes.elements[lastId].elem
      processSelect(composition, {
        op: 'select',
        value: caretSelection([lastId], 0, { top: 0, left: 0 }),
      })
      return
    } else {
      // FIXME: How should this work if we have [ SPECIAL, SPECIAL, TEXT ] ?
      // Where should selection go ?
      const next = getSiblings(composition, [id])[1]
      if (next && isStringElement(next.elem)) {
        processSelect(composition, {
          op: 'select',
          value: caretSelection(next.path, 0, { top: 0, left: 0 }),
        })
        return
      }
      // Is it normal that we continue here or should we return ?
    }
  }

  const sel = selection || props.selection
  if (sel) {
    processSelect(composition, {
      op: 'select',
      value: sel,
    })
  }
}
