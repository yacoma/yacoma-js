import { Block } from '@lucidogen/build'
import * as actions from './actions'
import * as effects from './helpers'
import { setup } from './setup'
import { DialogConfig } from './types'

export * from './components'
export { DialogConfig, DialogSettings } from './types'

export const dialog: Block<DialogConfig> = {
  name: 'dialog',
  setup,
  state: {
    dialog: {
      // These are dummy value replaced
      components: {} as any,
    },
  },
  actions: {
    dialog: actions,
  },
  effects: {
    dialog: effects,
  },
}
