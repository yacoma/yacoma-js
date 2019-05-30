import { NewCollectionIcon, NewItemIcon, UploadIcon } from '@yacoma/document'
import { Families, Inspectors, Spacer } from '@yacoma/styled'
import { Context } from './app'
import {
  ChatInProgress,
  Explorer,
  ExplorerWidgetIcon,
  NewContactIcon,
  SearchIcon,
} from './components'

export const toolbar: Families[''] = {
  explorer: ExplorerWidgetIcon,
  search: {
    component: SearchIcon,
    enable(ctx: Context) {
      return ctx.state.styled.show['navigation']['explorer']
    },
  },
  spacer: Spacer,
  newContact: {
    component: NewContactIcon,
    enable(ctx: Context) {
      return ctx.state.data.auth.admin === true
    },
  },
  upload: UploadIcon,
  newCollection: NewCollectionIcon,
  newItem: NewItemIcon,
}

export const inspector: Inspectors = {
  navigation: {
    toolbar,
    children: {
      explorer: Explorer,
      progress: {
        group: 'progress',
        component: ChatInProgress,
        enable: () => true,
      },
    },
  },
}
