import { describe, expect, it } from 'test'

import { build } from '@lucidogen/build'
import { locale } from '@lucidogen/locale'
import { theme } from '@lucidogen/theme'

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
