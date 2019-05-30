import { Derive } from './app'
import { Theme } from './types'

export const selectedTheme: Derive<Theme> = parent => {
  const selectedTheme = parent.themes[parent.selected]
  const defaultTheme = parent.themes.default

  return Object.assign(
    {},
    defaultTheme || /* istanbul ignore next */ {},
    selectedTheme || /* istanbul ignore next */ {}
  )
}
