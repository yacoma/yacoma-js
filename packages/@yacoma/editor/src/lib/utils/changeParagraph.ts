import { caretSelection } from './caretSelection'
import { getAtPath } from './getAtPath'
import { ChangesType, CompositionType, ParagraphPayload, SelectionType } from './types'

export function changeParagraph(
  composition: CompositionType,
  selection: SelectionType,
  opts: ParagraphPayload
): ChangesType {
  const path = selection.anchorPath.slice(0, 1)
  const elem = getAtPath(composition, path)
  const newElem = Object.assign({}, elem)
  if (opts.c) {
    newElem.c = opts.c
    delete newElem.i
  } else {
    delete newElem.c
  }
  if (opts.o) {
    newElem.o = opts.o
  } else {
    delete newElem.o
  }
  const id = path[0]
  const changes: ChangesType = {
    elements: { [id]: { elem: newElem, path } },
    updated: [id],
    selected: [id],
    selection: caretSelection(selection.anchorPath, 0, selection.position),
  }
  if (opts.data) {
    changes.data = { [id]: opts.data }
  }

  return changes
}
