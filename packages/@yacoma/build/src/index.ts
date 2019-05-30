import { IConfiguration, IOperator, mutate, Overmind, parallel } from 'overmind'
import { Options } from 'overmind/lib/internalTypes'
import { addDependencies } from './addDependencies'
import { Block, Setup, UnknownObject, Using } from './types'

export { Block, Setup } from './types'
export * from './reference'

function mergeElements<T>(
  type: 'actions' | 'effects',
  resultConfig: Result,
  trackDefinitions: { [key: string]: { [key: string]: string } },
  block: Block
) {
  const base = block[type] as { [key: string]: any }
  if (!base) {
    return
  }
  const elements = resultConfig[type]
  const defined = trackDefinitions[type]
  const blockName = block.name

  Object.keys(base).forEach(name => {
    const alreadyDefined = defined[name]
    if (alreadyDefined) {
      throw new Error(
        `${type}: cannot redefine '${name}' in '${blockName}' (already defined in '${alreadyDefined}').`
      )
    }
    defined[name] = blockName
    elements[name] = base[name]
  })
}

interface Result extends IConfiguration {
  actions: any
  effects: any
  reactions: any
  state: any
}

function parseBlocks(theBlocks: Block[]) {
  const blocks = addDependencies(theBlocks)
  const setupFuncs: { [blockName: string]: Setup } = {}
  const initializers: IOperator<any, any, any>[] = []
  const result: Result = {
    actions: {},
    effects: {},
    reactions: {},
    state: {},
  }
  const rsettings: any = {}
  const definedIn: { [key: string]: { [key: string]: string } } = {
    actions: {},
    effects: {},
    reactions: {},
  }

  // (1) Merge state and collect settings from bottom to top.
  blocks
    .slice()
    .reverse()
    .forEach(block => {
      const name = block.name
      if (!name) {
        console.log(block)
        throw new Error(`Invalid block (missing name).`)
      }

      // Setup function.
      if (block.setup) {
        setupFuncs[name] = block.setup
      }

      // App boot
      if (block.onInitialize) {
        initializers.push(mutate(block.onInitialize))
      }

      // Merge state.
      if (block.state) {
        result.state = deepMerge(block.name, result.state, block.state, [
          'state',
        ])
      }

      mergeElements('actions', result, definedIn, block)
      mergeElements('effects', result, definedIn, block)

      // Collect settings.
      if (block.settings) {
        const blockSettings = block.settings as any
        Object.keys(blockSettings).forEach(key => {
          rsettings[key] = rsettings[key] || {}
          rsettings[key][name] = blockSettings[key]
        })
      }
    })

  const onInitialize = parallel(...initializers)

  result.onInitialize = onInitialize

  // (2) Run init functions (from bottom to top)
  Object.keys(setupFuncs).forEach(key => {
    const fn = setupFuncs[key]
    fn(result, rsettings[key] || {})
  })
  return result
}

export function build<T extends Block>(a: T): Using<T> {
  const blocks: Block[] = []
  let builder: any
  function using<U extends Block>(block: U) {
    blocks.push(block)
    return builder
  }

  builder = {
    state: new Error(`Please run 'config()' or 'app()' to finish build.`),
    using,
    config: () => parseBlocks(blocks),
    app: (options?: Options) => new Overmind(parseBlocks(blocks)),
  }

  return builder.using(a)
}

function isObj(x: unknown): x is UnknownObject {
  return typeof x === 'object' && !Array.isArray(x)
}

function deepMerge<T extends UnknownObject, U extends UnknownObject>(
  bName: string,
  base: T,
  changes: U,
  path: string[]
): U & T {
  const result = Object.assign({}, base)
  Object.keys(changes).forEach(key => {
    const value = changes[key]
    const rvalue = result[key]
    if (isObj(rvalue)) {
      if (isObj(value)) {
        result[key] = deepMerge(bName, rvalue, value, [...path, key])
      } else {
        throw new Error(
          `Cannot merge: incompatible types at path '${[...path, key].join(
            '.'
          )}' (block '${bName}' has '${typeof value}' instead of '${typeof rvalue}').`
        )
      }
    } else if (rvalue === undefined || typeof rvalue === typeof value) {
      result[key] = value
    } else {
      throw new Error(
        `Cannot merge: incompatible types at path '${[...path, key].join(
          '.'
        )}' (block '${bName}' has '${typeof value}' instead of '${typeof rvalue}').`
      )
    }
  })
  return result as T & U
}

/** Typing function used to ensure the settings for a block correspond to the
 * given type.
 */
export function settings<T>(arg: T): T {
  return arg
}
