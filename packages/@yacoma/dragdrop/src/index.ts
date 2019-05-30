import { Block } from '@yacoma/build'
import * as actions from './actions'
import { setup } from './setup'
import { DragdropConfig } from './types'

export * from './components'
export * from './draggable'
export * from './droppable'
export * from './fileDrop'
export * from './types'

export const dragdrop: Block<DragdropConfig> = {
  name: 'dragdrop',
  setup,
  state: {
    dragdrop: {
      // Mouse position
      position: { x: 0, y: 0 },
      definitions: () => () => ({}),
    },
    // Need to create 'data' for uploadLimit
    data: {},
  },
  actions: {
    dragdrop: actions,
  },
}
