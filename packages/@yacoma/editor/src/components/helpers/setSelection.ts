import { SelectionType } from '../../lib'

export function setSelection(
  node: HTMLElement,
  selection: SelectionType | undefined,
  ignoreOffset: boolean = false
) {
  if (node && selection) {
    const textNode = node.childNodes[0]
    const range = document.createRange()
    range.setStart(textNode, ignoreOffset ? 0 : selection.anchorOffset)
    if (selection.type === 'Range') {
      const focus = selection.focusPath[selection.focusPath.length - 1]
      const el = document.querySelector(`[data-ref="${focus}"]`)
      if (!el) {
        throw new Error(`Cannot find selection end element '${focus}'.`)
      }
      range.setEnd(el.childNodes[0], selection.focusOffset)
    }

    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
}
