import { CompositionHolder, getTitle } from '../lib'
import { getAtPath } from '../lib/utils/getAtPath'

export function changed(holder: CompositionHolder) {
  if (!holder.$changed) {
    holder.$changed = true
  }
  const { composition } = holder
  if (!composition) {
    return
  }
  const title = getTitle(composition) || ''
  if (title !== holder.title) {
    holder.title = title
  }
}

export function clearSelection(holder: CompositionHolder) {
  const { composition } = holder
  if (!composition) {
    return
  }
  const { spath } = composition
  if (!spath) {
    return
  }
  const elem = getAtPath(composition, spath.split('.'))
  if (elem.s) {
    delete elem.s
  }
  delete composition.spath
}
