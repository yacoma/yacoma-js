import { Action } from '../app'
import { runHook } from '../helpers'
import { DragData, Position } from '../types'

export interface StartArg {
  drag: DragData
  position: Position
}

export const start: Action<StartArg> = (ctx, value) => {
  const { state } = ctx
  state.dragdrop.drag = value.drag
  state.dragdrop.position = value.position

  // Start hook is run after
  runHook('start', ctx, value)
}
