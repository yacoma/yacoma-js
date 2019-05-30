import { Setup } from '@yacoma/build'
import { EditorOptions } from './lib'
import * as defaultMarkup from './markup'
import { defaultParagraphs } from './paragraphs'
import { parseOptions } from './parseOptions'
import { EditorConfig, EditorSettings } from './types'

type Keys = keyof EditorOptions

export const setup: Setup<EditorConfig, EditorSettings> = (
  config,
  blockSettings
) => {
  const settings: EditorOptions = { markup: {}, paragraphs: {} }
  Object.keys(blockSettings).forEach(blockName => {
    const opts = blockSettings[blockName]
    const keys = Object.keys(opts) as Keys[]
    keys.forEach(key => {
      const value = opts[key]
      if (typeof value === 'object') {
        // deep merge
        settings[key] = Object.assign(settings[key] || {}, value)
      } else {
        settings[key] = value
      }
    })
  })

  if (!settings.noDefaults) {
    settings.markup = Object.assign(defaultMarkup, settings.markup)
    settings.paragraphs = Object.assign(defaultParagraphs, settings.paragraphs)
  }

  config.state.editor.options = () => () =>
    Object.assign({}, parseOptions(settings))
}
