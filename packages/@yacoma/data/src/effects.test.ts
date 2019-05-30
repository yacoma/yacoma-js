import { CerebralTest } from 'cerebral/test'
import * as gqlRequest from 'graphql-request'
import simple from 'simple-mock'
import { beforeEach, describe, expect, it } from 'test'

import { ModuleDefinition } from '../../build'
import { Context } from './app.cerebral'
import { makeProvider } from './provider'
import { BaseType, TypeHandler } from './types'

interface Item extends BaseType {
  id: string
  type: 'Item'
  content: string
  deleted?: boolean
}

const data = makeProvider({
  endpoint: 'some.site:1234',
  types: {
    Item: {
      query: 'QUERY',
      mutation: 'MUTATION',
      subscription: 'SUBSCRIPTION',
      callback<Item>(entity: Item, ctx: Context) {},
    },
  },
})

function makeTest(call: any, action: any, providers = { data }, state = {}) {
  simple.mock(gqlRequest, 'request').callFn((...args: any[]) => {
    call.args = args
    return Promise.resolve({ mutation: args[2] })
  })
  const root = {
    state,
    providers,
    sequences: {
      test: [action],
    },
  }
  return CerebralTest(root).runSequence('test', {})
}

const fouItem: Item = { id: 'foo', content: 'Foo', type: 'Item' }

function makeThrowTest(action: any) {
  simple.mock(gqlRequest, 'request').callFn((...args: any[]) => {
    return Promise.reject(new Error('bang'))
  })
  const root = {
    state: {
      data: { Item: { foo: JSON.parse(JSON.stringify(fouItem)) } },
    },
    providers: { data },
    sequences: {
      test: [action],
    },
  }
  return CerebralTest(root)
}

describe('data.mutate', () => {
  beforeEach(() => {
    simple.restore()
  })

  it('should request all entities from remote on boot', () => {
    const call: any = {}
    makeTest(call, ({ data }: Context) =>
      data.mutate({ content: 'Hello' }, fouItem)
    ).then(output => {
      expect(output[0]).toEqual({
        output: {
          id: 'foo',
          content: 'Hello',
          type: 'Item',
        },
        props: {},
      })
      expect(call.args).toEqual([
        'http://some.site:1234/graphql',
        'MUTATION',
        { id: 'foo', content: 'Hello', type: 'Item' },
      ])
    })
  })

  it('should throw on missing id', () => {
    const call: any = {}
    let thrown = false
    makeTest(call, ({ data }: Context) => {
      return data.mutate({ content: 'Hello' }, { content: 'Fou', type: 'Item' })
    })
      .catch(error => {
        thrown = true
        expect(error.message).toBe(
          `Missing 'id' or 'type' in entity. Cannot mutate.`
        )
      })
      .then(() => {
        expect(thrown).toBe(true)
      })
  })

  it('should throw on missing type', () => {
    const call: any = {}
    let thrown = false
    makeTest(call, ({ data }: Context) => {
      return data.mutate({ content: 'Hello' }, { id: 'foo', content: 'Fou' })
    })
      .catch(error => {
        thrown = true
        expect(error.message).toBe(
          `Missing 'id' or 'type' in entity. Cannot mutate.`
        )
      })
      .then(() => {
        expect(thrown).toBe(true)
      })
  })

  it('should throw on missing handler', () => {
    const call: any = {}
    let thrown = false
    makeTest(call, ({ data }: Context) => {
      return data.mutate(
        { content: 'Hello' },
        { id: 'foo', content: 'Fou', type: 'Bang' }
      )
    })
      .catch(error => {
        thrown = true
        expect(error.message).toBe(`No handlers for 'Bang' type.`)
      })
      .then(() => {
        expect(thrown).toBe(true)
      })
  })

  it('should throw on missing mutation in handler', () => {
    const call: any = {}
    let thrown = false
    const data = makeProvider({
      endpoint: 'some.site:1234/graphql',
      types: {
        Item: {
          query: 'QUERY',
          // no mutation handler
          subscription: 'SUBSCRIPTION',
          callback<Item>(entity: Item, ctx: Context) {},
        } as TypeHandler,
      },
    })

    makeTest(
      call,
      ({ data }: Context) => {
        return data.mutate(
          { content: 'Hello' },
          { id: 'foo', content: 'Fou', type: 'Item' }
        )
      },
      { data }
    )
      .catch(error => {
        thrown = true
        expect(error.message).toBe(
          `Missing 'mutation' handler for 'Item' type.`
        )
      })
      .then(() => {
        expect(thrown).toBe(true)
      })
  })

  it('should delete element on deleted', () => {
    const call: any = {}
    makeTest(
      call,
      ({ data }: Context) => data.mutate({ deleted: true }, fouItem),
      // providers
      { data },
      // state
      { data: { Item: { foo: 'something' } } }
    ).then(output => {
      expect(output.state).toEqual({
        data: {
          Item: {},
        },
      })
    })
  })

  it('should create element', () => {
    const call: any = {}
    makeTest(call, ({ data }: Context) => {
      return data.mutate<Item>({ id: 'bong', content: 'Fou', type: 'Item' })
    }).then(output => {
      expect(output.state).toEqual({
        data: {
          Item: {
            bong: {
              id: 'bong',
              content: 'Fou',
              type: 'Item',
            },
          },
        },
      })
    })
  })

  it('should restore delete on request failure', () => {
    let thrown = false
    const test = makeThrowTest(({ data }: Context) =>
      data.mutate({ deleted: true }, fouItem)
    )
    return test
      .runSequence('test', {})
      .catch(() => {
        thrown = true
      })
      .then(output => {
        expect(thrown).toBe(true)
        expect(test.controller.getState()).toEqual({
          data: { Item: { foo: fouItem } },
        })
      })
  })

  it('should restore old value on request failure', () => {
    let thrown = false
    const test = makeThrowTest(({ data }: Context) =>
      data.mutate({ content: 'Bang bang' }, fouItem)
    )
    return test
      .runSequence('test', {})
      .catch(() => {
        thrown = true
      })
      .then(output => {
        expect(thrown).toBe(true)
        expect(test.controller.getState()).toEqual({
          data: { Item: { foo: fouItem } },
        })
      })
  })

  it('should remove value on create failure', () => {
    let thrown = false
    const test = makeThrowTest(({ data }: Context) => {
      return data.mutate({ id: 'hop', content: 'Fou', type: 'Item' })
    })
    return (
      test
        .runSequence('test', {})
        // eslint-disable-next-line
      .catch(err => {
          thrown = true
        })
        .then(output => {
          expect(thrown).toBe(true)
          expect(test.controller.getState()).toEqual({
            data: { Item: { foo: fouItem } },
          })
        })
    )
  })
})

describe('data.mutated', () => {
  it('should trigger data.mutated sequence', () => {
    let called: any
    const dataModule: ModuleDefinition = {
      sequences: {
        mutated: [
          ({ props }: Context<{ entity: any }>) => {
            called = props.entity
          },
        ],
      },
    }
    const root = {
      state: {},
      providers: { data },
      sequences: {
        test: [
          ({ data }: Context) => {
            data.mutated({ id: 'any', type: 'Item' })
          },
        ],
      },
      modules: {
        data: dataModule,
      },
    }
    return CerebralTest(root)
      .runSequence('test', {})
      .then(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              // Wait for other signal to run
              expect(called).toEqual({ id: 'any', type: 'Item' })
              resolve()
            }, 10)
          })
      )
  })
})
