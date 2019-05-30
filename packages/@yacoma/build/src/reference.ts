import { IS_PROXY, PATH } from 'proxy-state-tree'

export interface Reference<T> {
  _type: T
  _reference: string
}

function checkProxy(arg: any) {
  if (typeof arg !== 'object' || arg[IS_PROXY]) {
    throw new Error(`Cannot get parent of non-proxy.`)
  }
}

function getAtPath(rootState: any, path: string[]): any {
  let current = rootState
  for (let p of path) {
    if (typeof current !== 'object') {
      return undefined
    }
    current = current[p]
    if (!current) {
      return undefined
    }
  }
  return current
}

export function reference<T>(arg: T): Reference<T> {
  if (typeof arg !== 'object') {
    throw new Error('bad')
  }
  const proxy = arg as any
  return { _reference: proxy[PATH] } as Reference<T>
}

export function resolve<T>(
  ctx: { state: any },
  ref: Reference<T> | undefined
): T | undefined {
  if (!ref) {
    return undefined
  }
  return getAtPath(ctx.state, ref._reference.split('.'))
}

export function parent<T>(ctx: { state: any }, arg: any): T | undefined {
  checkProxy(arg)
  const path = arg[PATH].split('.').pop()
  if (path.length) {
    return getAtPath(ctx.state, path)
  } else {
    return undefined
  }
}
