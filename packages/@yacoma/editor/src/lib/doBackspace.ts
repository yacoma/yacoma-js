import { caretSelection } from './utils/caretSelection'
import { deleteSelection } from './utils/deleteSelection'
import { getAtPath } from './utils/getAtPath'
import { getNeighbours } from './utils/getNeighbours'
import { isTextBlock } from './utils/isTextBlock'
import { mergeElements } from './utils/mergeElements'
import {
  CompositionType,
  EditorProvider,
  isCustomElement,
  isSpecialElement,
  OperationsType,
  SelectionType,
  OperationType,
} from './utils/types'

/** Returns the list of operations to remove selected text.
 *
 */
export function doBackspace(
  editor: EditorProvider,
  composition: CompositionType,
  selection: SelectionType
): OperationType[] | undefined {
  const { type, anchorPath, anchorOffset } = selection
  if (type === 'Caret') {
    if (anchorOffset === 0) {
      const elem = getAtPath(composition, anchorPath)
      const prev = getNeighbours(composition, anchorPath)[0]
      if (isCustomElement(elem)) {
        if (!prev) {
          // Cannot remove last element. Ignore
          return []
        }
        // Delete selected element
        // Delete THIS, select PREVIOUS.
        const ops: OperationsType = []
        ops.push({ op: 'delete', path: anchorPath })
        ops.push({
          op: 'select',
          value: caretSelection(
            prev.path,
            isTextBlock(prev.elem) ? prev.elem.i.length : 0,
            { top: 0, left: 0 }
          ),
        })
        ops.push({ op: 'toolbox' })
        return ops
      } else if (elem.i === '') {
        // Empty element, simply remove
        if (!prev) {
          // Cannot remove last element. Ignore
          return []
        }
        if (isSpecialElement(editor, prev.elem)) {
          // [ SPECIAL, THIS ]
          // Delete THIS, select PREVIOUS.
          const ops: OperationsType = []
          ops.push({ op: 'delete', path: anchorPath })
          ops.push({
            op: 'select',
            value: caretSelection(prev.path, 0, { top: 0, left: 0 }),
          })
          ops.push({ op: 'toolbox' })
          return ops
        }
        if (!isTextBlock(prev.elem)) {
          // Can this happen ?
          throw new Error(`Previous block is not a text block`)
        }
        return [
          { op: 'delete', path: anchorPath },
          {
            op: 'select',
            value: caretSelection(prev.path, prev.elem.i.length, {
              top: 0,
              left: 0,
            }),
          },
        ]
      }
      // merge with previous
      if (prev) {
        if (isSpecialElement(editor, prev.elem)) {
          return [{ op: 'delete', path: prev.path }]
        } else {
          return mergeElements(composition, prev, { elem, path: anchorPath })
        }
      } else {
        return []
      }
    } else {
      // remove prev char
      return deleteSelection(composition, selection, 'Backspace')
    }
  }
  return deleteSelection(composition, selection, 'Backspace')
}
