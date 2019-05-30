import { renderStories } from '@yacoma/story'
import { defaultTheme as theme } from '@yacoma/theme'
import * as stories from './all'

declare var module: any

renderStories({ theme }, stories)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
