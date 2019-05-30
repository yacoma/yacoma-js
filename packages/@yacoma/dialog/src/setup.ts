import { Setup } from '@yacoma/build'
import {
  DialogComponents,
  DialogComponentSettings,
  DialogConfig,
  DialogSettings,
} from './types'

export * from './components'
export { DialogConfig, DialogSettings } from './types'

function addSettings(
  dialogs: DialogComponentSettings,
  settings: DialogComponents,
  exclusive: boolean
): void {
  Object.assign(
    dialogs,
    ...Object.keys(settings).map(key => ({
      [key]: {
        component: settings[key],
        exclusive,
      },
    }))
  )
}

export const setup: Setup<DialogConfig, DialogSettings> = (
  config,
  settings
) => {
  const components: DialogComponentSettings = {}
  Object.keys(settings).forEach(blockName => {
    const { overlay, exclusive } = settings[blockName]
    addSettings(components, overlay || {}, false)
    addSettings(components, exclusive || {}, true)
  })
  config.state.dialog.components = () => () => components
}
