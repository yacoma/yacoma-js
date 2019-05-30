import * as React from 'react'
import { build, settings } from '@yacoma/build'
import { dialog } from './'
import { DialogSettings, track } from './types'

describe('dialog', () => {
  it('should build with exclusive setting', () => {
    const main = {
      name: 'main',
      settings: settings<DialogSettings>({
        dialog: {
          exclusive: {
            Login: track(({ children }) => <div>LOGIN: {children}</div>),
          },
        },
      }),
    }
    const components = build(main)
      .using(dialog)
      .app()
      .state.dialog.components()
    expect(components).toEqual({
      Login: { component: components.Login.component, exclusive: true },
    })
  })

  it('should build without overlay setting', () => {
    const main = {
      name: 'main',
      settings: settings<DialogSettings>({
        dialog: {
          overlay: {
            Error: track(({ children }) => <div>ERROR: {children}</div>),
          },
        },
      }),
    }
    const components = build(main)
      .using(dialog)
      .app()
      .state.dialog.components()
    expect(components).toEqual({
      Error: { component: components.Error.component, exclusive: false },
    })
  })
})
