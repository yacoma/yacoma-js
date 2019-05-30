import { describe, expect, it } from 'test'

import { build } from '@lucidogen/build'
import { locale } from '@lucidogen/locale'
import { theme } from '@lucidogen/theme'

import { date } from './'

const myApp = (calls: { count: number }, nowInterval: number = 0.01) => {
  const config = Object.assign({}, date)
  config.actions!.date = Object.assign({}, config.actions!.date, {
    updateNow: (action: any) =>
      action.run(() => {
        calls.count++
      }),
  })
  config.state!.date.nowInterval = nowInterval
  return build(config)
    .using(locale)
    .using(theme)
    .app()
}

describe('date timer', () => {
  it('should set date.now to now', async () => {
    const calls = { count: 0 }
    const app = myApp(calls)
    await app.initialized
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        expect(calls.count).toBeGreaterThanOrEqual(2)
        expect(calls.count).toBeLessThanOrEqual(40)
        app.actions.date.haltNow()
        resolve()
      }, 200)
    })
  })

  it('should stop on 0 interval', async () => {
    const calls = { count: 0 }
    const app = myApp(calls, 0)
    await app.initialized
    return new Promise(resolve => {
      setTimeout(() => {
        expect(calls.count).toBe(0)
        resolve()
      }, 200)
    })
  })

  it('should set interval', () => {
    const calls = { count: 0 }
    const app = myApp(calls, 0)
    return app.initialized.then(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            expect(calls.count).toBe(0)
            // Twice to test callback reset
            app.actions.date.setInterval(0.005)
            app.actions.date.setInterval(0.011)
            setTimeout(() => {
              expect(calls.count).toBeGreaterThanOrEqual(2)
              expect(calls.count).toBeLessThanOrEqual(40)
              // Twice to test halt with empty callback
              app.actions.date.haltNow()
              app.actions.date.haltNow()
              resolve()
            }, 200)
          }, 200)
        })
    )
  })

  it('halting without callback should not fail', () => {
    const calls = { count: 0 }
    const app = myApp(calls)
    expect(app.actions.date.haltNow).not.toThrow(``)
  })
})
