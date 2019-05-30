import { build, settings } from '@yacoma/build'
import { locale, LocaleSettings } from './'

const foo = {
  name: 'foo',
  settings: settings<LocaleSettings>({
    locale: {
      common: { UserIcon: 'fa-user' },
      fr: { foo: 'le fou' },
      en: { foo: 'foobar' },
    },
  }),
}

const bar = {
  name: 'bar',
  settings: settings<LocaleSettings>({
    locale: {
      fr: { bar: 'le bar' },
      en: { bar: 'barman' },
    },
  }),
}

describe('locale', () => {
  it('parse all locales', () => {
    const app = build(locale)
      .using(foo)
      .using(bar)
      .app()
    expect(app.state.locale).toEqual({
      common: { UserIcon: 'fa-user' },
      lang: 'en',
      locales: {
        en: {
          bar: 'barman',
          foo: 'foobar',
        },
        fr: {
          bar: 'le bar',
          foo: 'le fou',
        },
      },
      translate: app.state.locale.translate,
    })
  })
})
