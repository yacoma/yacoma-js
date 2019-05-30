import { action } from 'overmind'
import { Block, build, settings } from '@yacoma/build'
import { dragdrop, DragdropSettings } from '../..'
import { Operator, TestConfig } from './app'
import { Doc } from './Doc'

export * from './app'
export * from './Doc'
export * from './Group'

const showPayload: Operator<any> = action((_, value) => {
  alert(`showPayload: ${JSON.stringify(value)}`)
})

const moveToGroup: Operator<{
  name: string
  group: string
  target: string
}> = action(({ state }, value) => {
  const { name, group, target } = value
  delete state.groups[group][name]
  state.groups[target][name] = name
})

const test: Block<TestConfig> = {
  name: 'test',
  settings: settings<DragdropSettings>({
    dragdrop: {
      doc: {
        // Element to show when dragging type 'doc'
        component: Doc,
        dragProps: { myprop: 'dragging ' },
      },
    },
  }),
  actions: {
    test: {
      showPayload,
    },
    group: {
      moveToGroup,
    },
  },
}

export const config = build(test)
  .using(dragdrop)
  .config()
