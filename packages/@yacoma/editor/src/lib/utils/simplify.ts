import { getAtPath } from './getAtPath'
import { isTextBlock } from './isTextBlock'
import { joinText } from './joinText'
import { makeRef } from './makeRef'
import { rangeSelection } from './rangeSelection'
import {
  ChangesType,
  CompositionType,
  EditorProvider,
  ElementNamedType,
  ElementRefType,
  GroupElementRefType,
  GroupElementRefTypeById,
  GroupElementType,
  isGroupElement,
  isRangeSelection,
  isSpecialElement,
  isStringElement,
  RangeSelectionType,
  StringElementType,
} from './types'

function simplifyParent(
  composition: CompositionType,
  changes: ChangesType,
  parent: GroupElementRefType
): void {
  const { elements, updated, selected } = changes
  let deleted: string[][]
  const { path, elem } = parent

  if (isStringElement(elem)) {
    throw new Error(`Not a valid parent at path '${path.join('.')}.`)
  }

  let last: ElementNamedType | undefined
  let allFused = true
  const children = elem.g
  Object.keys(children)
    .map(
      // Update children with content of elements
      ref => {
        const refElem = elements[ref]
        return refElem
          ? { ref, elem: refElem.elem }
          : { ref, elem: elem.g[ref] }
      }
    )
    .sort(
      // Display sort
      (a, b) => {
        return a.elem.p - b.elem.p
      }
    )
    .forEach(refElem => {
      const { ref, elem } = refElem
      const sidx = selected.indexOf(ref)
      if (sidx === 0) {
        const selectionPath = [...path, ref]
        changes.selection = rangeSelection(
          selectionPath,
          0,
          selectionPath,
          (elem as StringElementType).i.length
        )
        // These checks are just to make TS happy
      }

      if (!last) {
        // First element: simply mark as last.
        last = refElem
        if (sidx > 0 && isStringElement(elem)) {
          const selection = changes.selection as RangeSelectionType
          selection.focusOffset = elem.i.length
          selection.focusPath = [...path, ref]
        }
      } else if (
        last.elem.t === elem.t &&
        isTextBlock(last.elem) &&
        isTextBlock(elem)
      ) {
        // Can merge.
        let lastElem: StringElementType = last.elem
        // Make sure last is in updated list.
        if (!elements[last.ref]) {
          // make a copy
          lastElem = Object.assign({}, last.elem)
          last = {
            elem: lastElem,
            ref: last.ref,
          }
          const pathElem = {
            elem: lastElem,
            path: [...path, last.ref],
          }
          elements[last.ref] = pathElem
          updated.push(last.ref)
        }
        // Fuse current text element with last

        if (sidx >= 0) {
          const selection = changes.selection as RangeSelectionType
          if (sidx === 0) {
            // If first selected item fuses (sidx === 0): selection is 'in mid-air'
            selection.anchorPath = [...path, last.ref]
            selection.anchorOffset = lastElem.i.length
            selection.focusPath = [...path, last.ref]
            selection.focusOffset = lastElem.i.length + elem.i.length
          } else {
            selection.focusOffset += elem.i.length
          }
        }

        // console.log('FUSE', last.ref, ref )
        lastElem.i = joinText(lastElem.i, elem.i)

        // Remove current element from updated list
        let idx = updated.indexOf(ref)
        if (idx >= 0) {
          updated.splice(idx, 1)
        }
        if (!deleted) {
          changes.deleted = deleted = []
        }
        deleted.push([...path, ref])
      } else {
        // console.log
        // ( 'NO FUSE'
        // , last.ref + '-' + last.elem.t + '-' + isTextBlock ( last.elem )
        // , ref + '-' + elem.t + '-' + isTextBlock ( elem )
        // , JSON.stringify ( elem, null, 2 )
        // )
        if (sidx > 0 && isStringElement(elem)) {
          const selection = changes.selection as RangeSelectionType
          selection.focusOffset = elem.i.length
          selection.focusPath = [...path, ref]
        }
        allFused = false
        last = refElem
      }
    })

  if (last && allFused) {
    // All children fused into a single text element.
    const lastElem = last.elem
    // Remove last element from updated list
    let idx = updated.indexOf(last.ref)
    if (idx >= 0) {
      updated.splice(idx, 1)
    }
    // Change parent
    const parentRef = path[path.length - 1]
    const t =
      lastElem.t === 'T' ? parent.elem.t : `${parent.elem.t}+${lastElem.t}`
    const elem = Object.assign({}, parent.elem, { t, i: lastElem.i })
    delete elem.g

    elements[parentRef] = { elem, path }
    updated.push(parentRef)
    const { selection } = changes
    if (selection) {
      // We should update path.
      if (isRangeSelection(selection)) {
        if (selection.anchorPath.indexOf(parentRef) >= 0) {
          selection.anchorPath = path
        }
        if (selection.focusPath.indexOf(parentRef) >= 0) {
          selection.focusPath = path
        }
      }
    }
  }
}

/** Ensure last paragraph in composition is a plain text one.
 * We do this to make sure editing can continue after a custom or markup
 * paragraph.
 */
export function checkLast(
  editor: EditorProvider,
  composition: CompositionType,
  changes: ChangesType
): ElementRefType {
  const { elements } = changes
  const rootkeys = Object.keys(elements).filter(
    k => elements[k].path.length === 1
  )
  // Build final children list
  const g = Object.assign(
    {},
    composition.g,
    ...rootkeys.map(k => ({ [k]: elements[k].elem }))
  )
  const last = Object.keys(g).sort((a, b) => g[b].p - g[a].p)[0]
  const elem = g[last]
  if (isSpecialElement(editor, elem)) {
    const newId = makeRef()
    const newPara: StringElementType = {
      t: 'P',
      p: elem.p + 1,
      i: '',
    }
    changes.elements[newId] = {
      elem: newPara,
      path: [newId],
    }
    changes.updated.push(newId)
    return { elem: newPara, path: [newId] }
  } else {
    return { elem, path: [last] }
  }
}

export function simplify(
  editor: EditorProvider,
  composition: CompositionType,
  changes: ChangesType
): ChangesType {
  const { updated, elements } = changes
  const parents: GroupElementRefTypeById = {}
  updated.forEach(ref => {
    const { path } = elements[ref]
    const parentPath = path.slice(0, -1)
    const parentId = parentPath[parentPath.length - 1]
    if (parentId) {
      let refParent: GroupElementRefType = parents[parentId]
      if (!refParent) {
        const parentRef = elements[parentId]
        const parent = parentRef
          ? parentRef.elem
          : getAtPath(composition, parentPath)
        let parentElem: GroupElementType
        if (isStringElement(parent)) {
          parentElem = { ...parent, g: {} }
          delete parentElem.i
        } else if (isGroupElement(parent)) {
          parentElem = { ...parent, g: Object.assign({}, parent.g) }
        } else {
          throw new Error(`FIXME: custom tag`)
        }
        parents[parentId] = refParent = { elem: parentElem, path: parentPath }
      }
      // We change the parent so that it hold the new/modified children.
      refParent.elem.g[ref] = elements[ref].elem
    }
  })

  Object.keys(parents)
    .sort((a, b) => parents[a].elem.p - parents[b].elem.p)
    .forEach(parentId => {
      simplifyParent(composition, changes, parents[parentId])
    })

  checkLast(editor, composition, changes)

  return changes
}
