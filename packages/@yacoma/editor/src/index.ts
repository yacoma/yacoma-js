import { Block, settings } from '@lucidogen/build'
import { locale } from '@lucidogen/locale'
import { styled, StyledSettings } from '@lucidogen/styled'
import { theme, ThemeSettings } from '@lucidogen/theme'
import * as actions from './actions'
import * as effects from './effects'
import { icons } from './icons'
import { setup } from './setup'
import { editorTheme } from './theme'
import { EditorConfig } from './types'
export * from './components'
export { ElementTag as Paragraph } from './components'
export { getTitle, newComposition } from './lib'
export { caretSelection } from './lib/utils/caretSelection'
export { rangeSelection } from './lib/utils/rangeSelection'
export {
  CompositionType,
  CustomTagProps,
  EditorOptions,
  InitFunction,
  isTitle,
  ParagraphOption,
} from './lib/utils/types'
export * from './paragraphs'
export { editorTheme } from './theme'
export * from './types'

export const editor: Block<EditorConfig> = {
  name: 'editor',
  dependencies: [locale, styled, theme],
  setup,
  settings: settings<ThemeSettings & StyledSettings>({
    styled: {
      icons,
    },
    theme: {
      default: editorTheme,
    },
  }),
  state: {
    editor: {
      // These are dummy value replaced
      options: {} as any,
    },
  },
  actions: {
    editor: actions,
  },
  effects: {
    editor: effects,
  },
}
