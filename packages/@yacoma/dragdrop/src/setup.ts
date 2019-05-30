import { Setup } from '@yacoma/build'
import { DragdropConfig, DragdropDefinitions, DragdropSettings } from './types'

export const setup: Setup<DragdropConfig, DragdropSettings> = (
  config,
  settings
) => {
  const definitions: DragdropDefinitions = {}
  Object.keys(settings).forEach(blockName => {
    Object.assign(definitions, settings[blockName])
  })
  config.state.dragdrop.definitions = () => () => definitions
}
