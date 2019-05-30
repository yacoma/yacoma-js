import { SelectionType } from '../../lib'
import getPath from './getPath'

declare var global: any

export function getSelection(compId: string): SelectionType | undefined {
  const selection = global.getSelection()
  const { anchorNode, focusNode, focusOffset } = selection
  if (!anchorNode) {
    return
  }
  const anchor = anchorNode.parentElement as HTMLElement
  // We do this to make sure Caret is inserted at the start of blank
  // paragraphs so that deleting an empty paragraph takes a single
  // consistent backspace #97. When we insert first letter, the classList is still 'Empty', hence the test for the zero width char.
  const anchorOffset =
    anchor.classList.contains('Empty') &&
    anchor.innerText.charCodeAt(0) === 8203
      ? 0
      : selection.anchorOffset

  let { type } = selection
  if (!anchorNode) {
    return
  }
  const anchorPath = getPath(compId, anchorNode)
  if (!anchorPath) {
    // Selection is not in our composition
    return
  } else if (!anchorPath.length) {
    // Selected Composition itself. Unselect:
    window.getSelection().removeAllRanges()
    return
  }
  const focusPath =
    focusNode === anchorNode ? anchorPath : getPath(compId, focusNode)
  if (!focusPath) {
    // Should never happen as we checked for anchorPath
    return
  }
  if (focusPath.length === 0) {
    // Bug on double-click
    type = 'Caret'
  }
  const anchorValue = anchorNode.textContent
  const focusValue = focusNode.textContent
  const rects = selection.getRangeAt(0).getClientRects()

  const last = rects.length
    ? rects[rects.length - 1]
    : anchorNode.getClientRects()[0]
  if (type === 'Caret') {
    return {
      anchorPath,
      anchorOffset,
      type,
      anchorValue,
      position: {
        top: last.top,
        left: last.left + last.width,
      },
    }
  }

  const first = rects[0]
  if (!first) {
    // no selection
    throw new Error(`Cannot get selection.`)
  }

  let end
  if (
    first.top > last.top ||
    (first.top === last.top && first.left > last.left)
  ) {
    end = {
      top: first.top,
      left: first.left + first.width,
    }
  } else {
    end = {
      top: last.top,
      left: last.left + last.width,
    }
  }

  const atop = anchorNode.parentElement.getBoundingClientRect().top
  const ftop = focusNode.parentElement.getBoundingClientRect().top
  if (atop > ftop || (anchorNode === focusNode && anchorOffset > focusOffset)) {
    // reverse
    return {
      type,
      anchorOffset: focusOffset,
      focusOffset: anchorOffset,
      anchorPath: focusPath,
      focusPath: anchorPath,
      anchorValue: focusValue,
      position: end,
    }
  } else {
    return {
      type,
      anchorOffset,
      focusOffset,
      anchorPath,
      focusPath,
      anchorValue,
      position: end,
    }
  }
}
