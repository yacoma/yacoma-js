import { Derive } from './app'
import { Translate } from './types'

// Derived state
export const translate: Derive<Translate> = parent => {
  const { lang, locales, common } = parent
  if (lang === undefined) {
    throw new Error(`No locale. Make sure locale.lang is set !`)
  }
  const dictionary = locales[lang]
  if (dictionary === undefined) {
    throw new Error(`Missing dictionary for lang '${lang}'.`)
  }
  // Tracking is not linked to individual values. If we want this, we
  // should parse all keys.
  return function translate(key: string, mode?: string) {
    const k = mode ? `${key}${mode}` : key
    if (process.env.NODE_ENV === 'production') {
      const t = dictionary.hasOwnProperty(k) ? dictionary[k] : common[k]
      return t === undefined ? k : t
    } else {
      const k = mode ? `${key}${mode}` : key
      const t = dictionary.hasOwnProperty(k) ? dictionary[k] : common[k]
      if (t === undefined) {
        throw new Error(
          `Missing translation for '${key}${
            mode ? `, ${mode}` : ''
          }' in '${lang}'.`
        )
      }
      return t
    }
  }
}
