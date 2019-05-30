import { caretSelection } from './utils/caretSelection'
import { deleteSelection } from './utils/deleteSelection'
import { getAtPath } from './utils/getAtPath'
import { getPosition } from './utils/getPosition'
import { BIGGEST_PATH, extractPaths, SMALLEST_PATH } from './utils/inSelection'
import { isTextBlock } from './utils/isTextBlock'
import { makeRef } from './utils/makeRef'
import { newParagraph } from './utils/newParagraph'
import { splitText } from './utils/splitText'
import { trimLeft, trimRight } from './utils/trim'
import {
  CompositionType,
  ElementRefType,
  GroupElementType,
  isCustomElement,
  isStringElement,
  OperationType,
  SelectionType,
  SelectOperationType,
} from './utils/types'

/** Returns the list of operations after enter pressed.
 *
 */
export function doEnter(
  composition: CompositionType,
  selection: SelectionType
) {
  const deleteOps = deleteSelection(composition, selection)

  let { anchorPath, anchorOffset } = selection
  if (deleteOps) {
    const selectOp = deleteOps.find(op => op.op === 'select') as
      | SelectOperationType
      | undefined
    if (selectOp) {
      anchorPath = selectOp.value.anchorPath
      anchorOffset = selectOp.value.anchorOffset
    }
  }

  const ops: OperationType[] = deleteOps || []

  const parentPath = anchorPath.slice(0, 1)
  // FIXME: this breaks if there is no parent...
  const parent = composition.g[parentPath[0]] as GroupElementType
  const elem = getAtPath(composition, anchorPath)
  /* TODO: fix what happens when we enter a special element with selection,
   * or to edit/delete.
   * This idea with negative anchorOffset does not work.
  if ( anchorOffset < 0 && isStringElement ( elem ) ) {
    console.log ( 'ME', anchorOffset )
    anchorOffset += elem.i.length + 1
  } else {
    anchorOffset = 0
  }
   */
  // 1. Create new paragraph
  const newpara = newParagraph(composition, { path: parentPath, elem: parent })
  const newelem = newpara.elem
  if (isStringElement(parent)) {
    // Split text.
    if (anchorOffset < parent.i.length) {
      const { before, after } = splitText(parent.i, anchorOffset)
      ops.push({
        op: 'update',
        path: parentPath,
        value: Object.assign({}, parent, { i: trimRight(before) }),
      })
      newelem.i = trimLeft(after)
    }
    // No child to move.
  } else if (!isCustomElement(elem)) {
    const anchorPosition = getPosition(composition, anchorPath)
    // 2. Collect end of paragraph
    // TODO: move this in separate function
    const touchedElements: ElementRefType[] = []
    let lastPosition = -1
    extractPaths(
      parent.g,
      // Any missing level is "start is smaller"
      anchorPosition.concat(SMALLEST_PATH),
      // Any missing level is "end is bigger"
      BIGGEST_PATH,
      1,
      parentPath,
      touchedElements
    )
    touchedElements.forEach(({ path, elem }, idx) => {
      if (idx === 0) {
        if (isStringElement(elem)) {
          if (anchorOffset < elem.i.length) {
            const { before, after } = splitText(elem.i, anchorOffset)
            ops.push({
              op: 'update',
              path,
              value: Object.assign({}, elem, { i: trimRight(before) }),
            })
            newelem.i = trimLeft(after)
          }
        } else {
          // Maybe extractPaths only returns string elements. TODO: check.
          throw new Error('NOT IMPLEMENTED')
        }
      } else if (idx === 1 && isTextBlock(elem)) {
        // fuse with newelem
        Object.assign(newelem, { i: newelem.i + elem.i })
        ops.push({
          op: 'delete',
          path,
        })
      } else {
        // TODO: extract and use moveInPara from deleteSelection
        const gelem: GroupElementType = newelem as any

        if (isStringElement(newelem)) {
          gelem.g = {
            [makeRef()]: {
              t: 'T',
              p: ++lastPosition,
              i: newelem.i,
            },
          }
          delete gelem.i
        }
        gelem.g[path[path.length - 1]] = Object.assign({}, elem, {
          p: ++lastPosition,
        })

        ops.push({
          op: 'delete',
          path,
        })
      }
    })
  }

  ops.push({
    op: 'update',
    path: newpara.path,
    value: newelem,
  })
  ops.push({
    op: 'select',
    value: caretSelection(newpara.path, 0, selection.position),
  })
  return ops
}
