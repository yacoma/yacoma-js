import { Block, settings } from '@yacoma/build'
import { data } from '@yacoma/data'
import { DialogSettings } from '@yacoma/dialog'
import { dragdrop, DragdropSettings } from '@yacoma/dragdrop'
import { hooks, HooksSettings } from '@yacoma/hooks'
import { LocaleSettings } from '@yacoma/locale'
import { StyledSettings } from '@yacoma/styled'
import { theme, ThemeSettings } from '@yacoma/theme'
import * as actions from './actions'
import { ItemDrag, SaveAccessDialog } from './components'
import * as effects from './effects'
import { icons } from './icons'
import { inspector } from './inspector'
import { documentTheme } from './theme'
import { DocumentConfig } from './types'

export * from './components'
export * from './theme'
export * from './types'

export const document: Block<DocumentConfig> = {
  name: 'document',
  dependencies: [data, dragdrop, theme, hooks],
  settings: settings<
    DialogSettings &
      DragdropSettings &
      HooksSettings &
      LocaleSettings &
      ThemeSettings &
      StyledSettings
  >({
    dialog: {
      overlay: {
        SaveAccessDialog,
      },
    },
    dragdrop: {
      Item: {
        anchor: {
          x: 25,
          y: 25,
        },
        component: ItemDrag,
      },
      Collection: {
        anchor: {
          x: 25,
          y: 25,
        },
        component: ItemDrag,
      },
    },
    hooks: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      data_select: effects.clearForm,
    },
    locale: {
      en: {
        collectionSearchPlaceholder: 'search...',
        userSearchPlaceholder: 'search...',
        messagePlaceholder: 'message...',
        searchPlaceholder: 'search...',
        CollectionAccess: 'Collections',
        LoadingFile: 'Loading...',
        MyCollection: 'Documents',
        NewCollection: 'New Collection',
        NewDocument: 'New Document',
        NoDocuments: 'no documents',
        PrivateCollection: 'Private',
        Save: 'Save',
        SaveAccessTitle: 'Save access changes',
        SaveAccessMessage:
          'Please review your changes and add an optional message if you are sharing to new collections.',
        UserAccess: 'People',
      },
    },
    styled: {
      icons,
      inspector,
      family: {
        documentHeader: {},
      },
    },
    theme: {
      default: documentTheme,
    },
  }),
  state: {
    document: {
      form: {
        collectionSearch: '',
        userSearch: '',
        userAccess: {},
        collectionAccess: {},
      },
    },
  },
  actions: {
    document: actions,
  },
  effects: {
    document: effects,
  },
}
