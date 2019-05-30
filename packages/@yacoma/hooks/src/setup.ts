import { Setup } from '@yacoma/build'
import { Hook, HooksConfig, HooksSettings } from './types'

export const setup: Setup<HooksConfig, HooksSettings> = (config, settings) => {
  // Extract all 'locale' fields with translations.
  const hookLists: { [key: string]: Hook[] } = {}
  Object.keys(settings).forEach(blockName => {
    const hooks = settings[blockName]
    Object.keys(hooks).forEach(hookName => {
      if (!hookLists[hookName]) {
        hookLists[hookName] = []
      }
      hookLists[hookName].push(hooks[hookName])
    })
  })

  config.state.hooks = {
    hooks: () => () => hookLists,
  }
}
