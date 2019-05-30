import { PathType, RangeSelectionType, SelectionPositionType } from './types'

const DUMMY_POSITION = { top: 0, left: 0 }

export function rangeSelection(
  anchorPath: PathType,
  anchorOffset: number,
  focusPath: PathType,
  focusOffset: number,
  position: SelectionPositionType = DUMMY_POSITION
): RangeSelectionType {
  return {
    type: 'Range',
    anchorPath,
    anchorOffset,
    focusPath,
    focusOffset,
    position,
  }
}
