import { getSiblings } from './getSiblings'
import { inSelection } from './inSelection'
import { makeRef } from './makeRef'
import { splitText } from './splitText'
import {
  ChangesType,
  CompositionType,
  ElementRefType,
  isStringElement,
  RangeSelectionType,
} from './types'

function extractStart(
  composition: CompositionType,
  selection: RangeSelectionType,
  elemRef: ElementRefType
): ChangesType {
  const { path, elem } = elemRef
  const id = path[path.length - 1]
  const { anchorOffset } = selection
  if (isStringElement(elem)) {
    if (anchorOffset === 0) {
      return {
        elements: { [id]: elemRef },
        updated: [id],
        selected: [id],
      }
    } else {
      const { before, after } = splitText(elem.i, selection.anchorOffset)
      const rest = {
        elem: Object.assign({}, elem, { i: before, t: 'T' }),
        path,
      }
      delete rest.elem.s
      const newId = makeRef()
      const selected = {
        elem: Object.assign({}, elem, { i: after, t: 'T' }),
        path: path.slice(0, -1).concat(newId),
      }
      delete selected.elem.s
      // ==== Update parent ====
      if (path.length === 1) {
        // Root element: need to update
        const restId = newId
        const selId = makeRef()
        const parent = Object.assign({}, elem, { t: 'P', g: {} })
        delete parent.i
        delete parent.s
        const parentRef = { elem: parent, path }
        rest.path = [id, restId]
        rest.elem.p = 0
        selected.path = [id, selId]
        selected.elem.p = 1
        return {
          elements: { [restId]: rest, [selId]: selected, [id]: parentRef },
          updated: [id, restId, selId],
          selected: [selId],
        }
      } else {
        const [, nextSibling] = getSiblings(composition, path)
        if (nextSibling) {
          selected.elem.p = (elem.p + nextSibling.elem.p) / 2
        } else {
          selected.elem.p = elem.p + 1
        }
        return {
          elements: { [id]: rest, [newId]: selected },
          updated: [id, newId],
          selected: [newId],
        }
      }
    }
  } else {
    // If this happens, it's a bug.
    throw new Error(`Cannot extract start from non-string element.`)
  }
}

function extractEnd(
  composition: CompositionType,
  selection: RangeSelectionType,
  elemRef: ElementRefType,
  reuseStart: boolean = false
): ChangesType {
  const { path, elem } = elemRef
  const id = path[path.length - 1]
  const { focusOffset } = selection
  if (isStringElement(elem)) {
    if (focusOffset === elem.i.length) {
      return {
        elements: { [id]: elemRef },
        updated: [id],
        selected: [id],
      }
    } else {
      const { inside, after } = splitText(elem.i, 0, focusOffset)
      const newId = makeRef()
      const selId = reuseStart ? id : newId
      const restId = reuseStart ? newId : id
      const selPath = path.slice(0, -1).concat(selId)
      const restPath = path.slice(0, -1).concat(restId)
      const rest = {
        elem: Object.assign({}, elem, { i: after, t: 'T' }),
        path: restPath,
      }
      delete rest.elem.s
      const selected = {
        elem: Object.assign({}, elem, { i: inside, t: 'T' }),
        path: selPath,
      }
      delete selected.elem.s

      // ==== Update parent ====
      if (path.length === 1) {
        // Root element: need to update
        const restId = makeRef()
        const parent = Object.assign({}, elem, { t: 'P', g: {} })
        delete parent.i
        delete parent.s
        const parentRef = { elem: parent, path }
        selected.path = [id, selId]
        selected.elem.p = 0
        rest.path = [id, restId]
        rest.elem.p = 1
        return {
          elements: { [id]: parentRef, [selId]: selected, [restId]: rest },
          updated: [id, selId, restId],
          selected: [selId],
        }
      } else {
        // Compute position of new item.
        if (!reuseStart) {
          const [, nextSibling] = getSiblings(composition, path)
          if (nextSibling) {
            rest.elem.p = (elem.p + nextSibling.elem.p) / 2
          } else {
            rest.elem.p = elem.p + 1
          }
        } else {
          rest.elem.p = elem.p + 1
        }
        return {
          elements: { [selId]: selected, [restId]: rest },
          updated: [selId, restId],
          selected: [selId],
        }
      }
    }
  } else {
    // If this happens, it's a bug.
    throw new Error(`Cannot extract end from non-string element.`)
  }
}

/** Given a composition and a selection, returns the
 * extracted elements in the selection in 'selected'.
 * In 'updated', returns changed elements.
 * Operations must first alter 'selected' in place and then
 * process 'updated'.
 */
export function extractSelection(
  composition: CompositionType,
  selection: RangeSelectionType
): ChangesType {
  const touched = inSelection(composition, selection)
  const { anchorOffset, focusOffset } = selection
  const changes = extractStart(composition, selection, touched[0])
  if (touched.length === 1) {
    // start === end
    if (anchorOffset === 0) {
      // Selected from start
      return extractEnd(composition, selection, touched[0])
    } else {
      const newId = changes.updated[changes.updated.length - 1]
      // Get end from updated 'start'
      const selection2 = Object.assign({}, selection, {
        anchorOffset: 0,
        focusOffset: focusOffset - anchorOffset,
      })
      const endChanges = extractEnd(
        composition,
        selection2,
        changes.elements[newId],
        true
      )
      Object.assign(changes.elements, endChanges.elements)
      if (endChanges.updated.length > 1) {
        changes.updated.push(endChanges.updated[endChanges.updated.length - 1])
      }
      return changes
    }
  }
  touched.slice(1, -1).forEach(elemRef => {
    const id = elemRef.path[elemRef.path.length - 1]
    changes.elements[id] = elemRef
    changes.updated.push(id)
    changes.selected.push(id)
  })

  const endChanges = extractEnd(
    composition,
    selection,
    touched[touched.length - 1]
  )
  Object.assign(changes.elements, endChanges.elements)
  endChanges.updated.forEach(id => changes.updated.push(id))
  endChanges.selected.forEach(id => changes.selected.push(id))

  return changes
}
