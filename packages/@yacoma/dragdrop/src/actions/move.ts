import { Action } from '../app'
import { runHook } from '../helpers'
import { Position } from '../types'

export interface MoveArg {
  position: Position
}

export const move: Action<MoveArg> = (ctx, value) => {
  const { state } = ctx
  state.dragdrop.position = value.position

  // Move hook is run after
  runHook('move', ctx, value)
}
