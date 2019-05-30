import { build } from '@yacoma/build'
import { locale } from '@yacoma/locale'
import { theme } from '@yacoma/theme'
import { styled } from '../'

describe('valueChanged', () => {
  it('should change form value', () => {
    const app = build({
      name: 'app',
      state: {
        login: {
          username: '',
        },
      },
    })
      .using(styled)
      .using(locale)
      .using(theme)
      .app()
    const form = app.state.login
    const name = 'username'
    const value = 'Joe'
    app.actions.styled.valueChanged({ form, name, value })
    expect(form).toEqual({ username: 'Joe' })
    expect(app.state.login).toEqual({ username: 'Joe' })
  })
})
