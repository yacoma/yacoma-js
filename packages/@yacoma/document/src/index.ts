import { Block, settings } from '@lucidogen/build'
import { data } from '@lucidogen/data'
import { DialogSettings } from '@lucidogen/dialog'
import { dragdrop, DragdropSettings } from '@lucidogen/dragdrop'
import { hooks, HooksSettings } from '@lucidogen/hooks'
import { LocaleSettings } from '@lucidogen/locale'
import { StyledSettings } from '@lucidogen/styled'
import { theme, ThemeSettings } from '@lucidogen/theme'
import * as actions from './actions'
import { ItemDrag, SaveAccessDialog } from './components'
import * as effects from './effects'
import { clearForm } from './effects'
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
      data_select: clearForm,
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
