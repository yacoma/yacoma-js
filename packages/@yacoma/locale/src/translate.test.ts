import { Overmind } from 'overmind'
import { describe, expect, it } from 'test'

import { translate } from './translate'

const config = {
  state: {
    locale: {
      lang: 'fr',
      common: { UserIcon: 'fa-user-o' },
      locales: { fr: { foo: 'le fou' } },
      translate,
    },
  },
}
const app = new Overmind(config)
const translateFunc = app.state.locale.translate

describe('translate', () => {
  it('should return a function', () => {
    expect(typeof translateFunc).toBe('function')
  })

  it('should translate common', () => {
    expect(translateFunc('User', 'Icon')).toBe('fa-user-o')
  })

  it('should translate lang specifics', () => {
    expect(translateFunc('foo')).toBe('le fou')
  })

  it('should throw in dev', () => {
    const env = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    expect(() => translateFunc('nokey')).toThrow(
      "Missing translation for 'nokey' in 'fr'"
    )
    expect(() => translateFunc('nokey', 'Scope')).toThrow(
      "Missing translation for 'nokey, Scope' in 'fr'"
    )
    process.env.NODE_ENV = env
  })

  it('should return key in production', () => {
    const env = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    expect(translateFunc('nokey')).toBe('nokey')
    expect(translateFunc('nokey', 'Scope')).toBe('nokeyScope')
    process.env.NODE_ENV = env
  })

  it('should translate in production', () => {
    const env = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    expect(translateFunc('foo')).toBe('le fou')
    expect(translateFunc('User', 'Icon')).toBe('fa-user-o')
    process.env.NODE_ENV = env
  })

  it('should raise error on missing lang', () => {
    const app = new Overmind({
      state: {
        locale: {
          locales: { fr: { foo: 'le fou' } },
          translate,
        },
      },
    })
    expect(() => {
      console.log(app.state.locale.translate)
    }).toThrow('No locale. Make sure locale.lang is set !')
  })

  it('should raise error on missing dictionary', () => {
    const app = new Overmind({
      state: {
        locale: {
          lang: 'es',
          locales: { fr: { foo: 'le fou' } },
          translate,
        },
      },
    })
    expect(() => {
      console.log(app.state.locale.translate)
    }).toThrow("Missing dictionary for lang 'es'.")
  })
})
