import * as effects from './effects'

export interface Hook {
  (ctx: any, arg: any):
    | Promise<boolean | undefined | void>
    | boolean
    | undefined
    | void
}

export interface Hooks {
  [key: string]: Hook
}

export interface HooksSettings {
  hooks?: Hooks
}

export interface HooksConfig {
  state: {
    hooks: {
      // PRIVATE
      hooks: () => () => { [key: string]: Hook[] }
    }
  }

  effects: {
    hooks: typeof effects
  }
}
