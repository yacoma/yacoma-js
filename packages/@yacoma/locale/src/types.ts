import { Operator, Derive } from './app'

export interface Locales {
  [lang: string]: {
    [keyAndScope: string]: string
  }
}

export interface LocaleSettings {
  locale?: Locales
}

export interface Translate {
  (key: string, scope?: string): string
}
export interface LocaleConfig {
  state: {
    locale: {
      // Currently selected lang
      lang: string
      // PRIVATE
      locales: Locales
      common: { [keyAndScope: string]: string }
      // Compute: returns a function to translate a string using current lang.
      translate: Derive<Translate>
    }
  }

  actions: {
    locale: {
      set: Operator<string>
    }
  }
}
