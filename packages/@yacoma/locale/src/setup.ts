import { Setup } from '@lucidogen/build'
import { LocaleConfig, LocaleSettings } from './types'

export const setup: Setup<LocaleConfig, LocaleSettings> = (
  config,
  settings
) => {
  // Extract all 'locale' fields with translations.
  const locales = config.state.locale.locales
  const common = config.state.locale.common
  Object.keys(settings).forEach(blockName => {
    const dictionaries = settings[blockName]
    Object.keys(dictionaries).forEach(lang => {
      if (lang === 'common') {
        Object.assign(common, dictionaries[lang])
      } else {
        if (!locales[lang]) {
          locales[lang] = {}
        }
        // Last defined translation for conflicting keys wins.
        Object.assign(locales[lang], dictionaries[lang])
      }
    })
  })
}
