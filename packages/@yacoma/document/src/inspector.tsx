import { Families, Icon, Inspectors, Spacer } from '@yacoma/styled'
import { Context } from './app'
import {
  CollectionAccessIcon,
  CollectionAccessView,
  SaveAccessChanges,
  SaveIcon,
  UserAccessIcon,
  UserAccessView,
} from './components'

const toolbar: Families[''] = {
  CollectionAccess: CollectionAccessIcon,
  UserAccess: UserAccessIcon,
  spacer: Spacer,
  save: SaveIcon,
  close: {
    component: Icon,
    props(ctx: Context) {
      return {
        icon: 'Close',
        onClick() {
          ctx.actions.data.select(undefined)
        },
      }
    },
  },
}

export const inspector: Inspectors = {
  document: {
    enable(ctx: Context) {
      return ctx.state.document.selected !== undefined
    },
    toolbar,
    children: {
      CollectionAccess: {
        group: 'edit',
        component: CollectionAccessView,
      },
      UserAccess: {
        group: 'edit',
        component: UserAccessView,
      },
      SaveAccessChanges: {
        group: 'save',
        visible(ctx: Context) {
          return ctx.state.document.form.changed === true
        },
        component: SaveAccessChanges,
      },
    },
  },
}
