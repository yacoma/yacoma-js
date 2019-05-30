import { describe, expect, it } from 'test'
import { build } from '@yacoma/build'
import { updateNow } from './'

const app = build({
  name: 'app',
  state: {
    date: {
      now: 0,
    },
  },
  actions: {
    updateNow,
  },
}).app()

describe('updateNow', () => {
  it('should set date.now to now', () => {
    const beforeTime = Date.now()
    app.actions.updateNow()
    const afterTime = Date.now()
    expect(app.state.date.now).toBeGreaterThanOrEqual(beforeTime)
    expect(app.state.date.now).toBeLessThanOrEqual(afterTime)
  })
})
