import { Block } from '@yacoma/build'
import * as effects from './effects'
import { setup } from './setup'
import { HooksConfig } from './types'

export * from './types'

export const hooks: Block<HooksConfig> = {
  name: 'hooks',
  setup,
  state: {
    hooks: {
      // dummy
      hooks: () => () => ({}),
    },
  },
  effects: {
    hooks: effects,
  },
}
