import { build } from '@yacoma/build'
import { locale } from '../'

describe('set', () => {
  it('should set locale', () => {
    const app = build(locale).app()
    app.actions.locale.set('ru')
    expect(app.state.locale.lang).toBe('ru')
  })
})
