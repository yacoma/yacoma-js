import { IAction } from 'overmind'
import { describe, expect, it } from 'test'
import { Block, build, Reference, reference, resolve } from './'

interface Foo {
  foo: string
}

interface RefConfig {
  state: {
    original: { item: Foo }
    other: { thing: Foo }
    ref?: Reference<Foo>
  }
  actions: {
    setOriginal: IAction<RefConfig, void, void>
    setOther: IAction<RefConfig, void, void>
    setValue: IAction<RefConfig, string, void>
    getValue: IAction<RefConfig, void, string | undefined>
  }
}

const config: Block<RefConfig> = {
  name: 'test',
  state: {
    original: { item: { foo: 'Original' } },
    other: { thing: { foo: 'Other' } },
  },

  actions: {
    setOriginal(ctx) {
      ctx.state.ref = reference(ctx.state.original.item)
    },

    setOther(ctx) {
      ctx.state.ref = reference(ctx.state.other.thing)
    },

    setValue(ctx, foo) {
      const item = resolve(ctx, ctx.state.ref)
      if (item) {
        item.foo = foo
      }
    },
    getValue(ctx) {
      const ref = resolve(ctx, ctx.state.ref)
      return ref ? ref.foo : undefined
    },
  },
}

describe('reference', () => {
  it('should store and resolve a reference', () => {
    const app = build(config).app()
    app.actions.setOther()
    expect(app.actions.getValue()).toEqual('Other')
    app.actions.setOriginal()
    expect(app.actions.getValue()).toEqual('Original')
    app.actions.setValue('bar')
    expect(app.actions.getValue()).toEqual('bar')
    expect(app.state.original.item.foo).toEqual('bar')
  })
})
