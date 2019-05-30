import { Operator } from './app'
import * as helpers from './helpers'

type DialogComponentType =
  | React.ComponentClass<{}>
  | React.FunctionComponent<{}>

export interface DialogComponentSettings {
  [key: string]: {
    component: DialogComponentType
    exclusive: boolean
  }
}

export interface DialogComponents {
  [key: string]: DialogComponentType
}

export interface DialogSettings {
  dialog?: {
    // Dialog components where we show the rest of the app.
    overlay?: DialogComponents
    // Dialog components where we hide the rest of the app.
    exclusive?: DialogComponents
  }
}

export interface DialogConfig {
  state: {
    dialog: {
      // Component to display as overlay dialog
      show?: string
      components: () => () => DialogComponentSettings
    }
  }
  actions: {
    dialog: {
      show: Operator<string>
      hide: Operator<void>
    }
  }
  effects: {
    dialog: typeof helpers
  }
}
