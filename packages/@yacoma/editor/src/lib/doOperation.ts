import { applyOp } from './utils/applyOp'
import { changeParagraph } from './utils/changeParagraph'
import { extractSelection } from './utils/extractSelection'
import { rangeSelection } from './utils/rangeSelection'
import { simplify } from './utils/simplify'
import {
  ChangesType,
  CompositionType,
  EditorProvider,
  isSpecialElement,
  isStringElement,
  OperationType,
  ParagraphPayload,
  RangeSelectionType,
  SelectionType,
} from './utils/types'

function makeOps(
  editor: EditorProvider,
  changes: ChangesType,
  initialSelection: SelectionType
): OperationType[] {
  const ops: OperationType[] = []
  const { updated, selected, selection, elements, deleted } = changes

  if (deleted) {
    deleted.forEach(path => {
      ops.push({
        op: 'delete',
        path,
      })
    })
  }

  updated.forEach(ref => {
    const { path, elem } = elements[ref]
    ops.push({
      op: 'update',
      path,
      value: elem,
    })
  })

  const selElem = elements[selected[0]]
  if (selection) {
    ops.push({
      op: 'select',
      value: { ...selection, position: initialSelection.position },
    })
    if (selElem && isSpecialElement(editor, selElem.elem)) {
      ops.push({ op: 'toolbox' })
    }
  } else if (selected) {
    const firstRef = selected[0]
    const firstRefElem = elements[firstRef]
    const lastRef = selected[selected.length - 1]
    const lastRefElem = elements[lastRef]
    const lastElem = lastRefElem.elem

    if (isStringElement(lastElem)) {
      ops.push({
        op: 'select',
        value: rangeSelection(
          firstRefElem.path,
          0,
          lastRefElem.path,
          lastElem.i.length,
          initialSelection.position
        ),
      })
      if (isSpecialElement(editor, lastElem)) {
        ops.push({ op: 'toolbox' })
      }
    } else {
      throw new Error(`Error in makeOps, element is not a string element.`)
    }
  }

  const data = changes.data
  if (data) {
    Object.keys(data).forEach(id => {
      ops.push({ op: 'data', data: data[id], path: [id] })
    })
  }

  return ops
}

interface SimpleOp {
  [key: string]: boolean
}

const SIMPLE_OP: SimpleOp = {
  B: true,
  I: true,
}

export function doOperation(
  editor: EditorProvider,
  composition: CompositionType,
  selection: SelectionType,
  op: string,
  opts: ParagraphPayload
): OperationType[] | undefined {
  if (op === 'P') {
    return makeOps(
      editor,
      simplify(
        editor,
        composition,
        changeParagraph(composition, selection, opts)
      ),
      selection
    )
  } else if (SIMPLE_OP[op]) {
    return makeOps(
      editor,
      simplify(
        editor,
        composition,
        applyOp(
          composition,
          extractSelection(composition, selection as RangeSelectionType),
          op
        )
      ),
      selection
    )
  }
  return undefined
}
