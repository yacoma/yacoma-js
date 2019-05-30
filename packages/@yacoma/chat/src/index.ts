import { Block, settings } from '@yacoma/build'
import { date } from '@yacoma/date'
import { document } from '@yacoma/document'
import { HooksSettings } from '@yacoma/hooks'
import { LocaleSettings } from '@yacoma/locale'
import { StyledSettings } from '@yacoma/styled'
import { ThemeSettings } from '@yacoma/theme'
import * as actions from './actions'
import { EditCollectionIcon } from './components'
import * as effects from './effects'
import { hooks } from './hooks'
import { icons } from './icons'
import { inspector } from './inspector'
import { chatTheme } from './theme'
import { ChatConfig } from './types'

export * from './components'
export * from './theme'

export const chat: Block<ChatConfig> = {
  name: 'chat',
  dependencies: [date, document],
  settings: settings<
    HooksSettings & LocaleSettings & ThemeSettings & StyledSettings
  >({
    hooks,
    locale: {
      en: {
        Chat: 'Chat',
        Done: 'Done',
        Me: 'Me',
        MyChat: 'Messages',
        Navigator: 'Navigator',
        PrivateCollection: 'Private',
        PrivateChat: 'Private',
        searchPlaceholder: 'search...',
        UnknownDocument: 'Unknown document',
      },
    },
    styled: {
      icons,
      inspector,
      family: {
        chatCollection: {
          Edit: EditCollectionIcon,
        },
      },
    },
    theme: {
      default: chatTheme,
    },
  }),
  state: {
    chat: {},
  },
  actions: {
    chat: actions,
  },
  effects: {
    chat: effects,
  },
}
