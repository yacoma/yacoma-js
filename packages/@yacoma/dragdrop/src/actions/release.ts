import { Action } from '../app'
import { runHook } from '../helpers'

export const release: Action = ctx => {
  const { state } = ctx
  // Release hook is run before drop operation.
  runHook('release', ctx, {})

  const { drag, drop } = state.dragdrop
  if (drag && drop) {
    drop.callback(Object.assign({}, drag.payload, drop.payload))
  }

  delete state.dragdrop.drag
  delete state.dragdrop.drop
}
