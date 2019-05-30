import { renderStories } from '@lucidogen/story'
import { defaultTheme as theme } from '@lucidogen/theme'

import * as stories from './all'

declare var module: any

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

renderStories({ theme }, stories)
