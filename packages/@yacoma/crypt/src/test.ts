import simple from 'simple-mock'

export type Describe = {
  (what: string, callback: () => void): void
  only: Describe
}

export interface It {
  (should: string, callback: () => void): void
  only: It
}

export interface Matcher {
  toBe(value: any): void
  toBeLessThanOrEqual(value: number): void
  toBeGreaterThanOrEqual(value: number): void
  toBeUndefined(): void
  toContain(value: any): void
  toEqual(value: any): void
  toMatchSnapshot(): void
  toMatch(re: RegExp): void
  toThrow(value: any): void
}

export type Expect = (value: any) => Matcher
export type FunctionCaller = (fn: () => void) => void
export type AfterAll = (fn: () => void) => void

declare var describe: Describe
declare var it: It
declare var expect: Expect
declare var beforeAll: FunctionCaller
declare var afterAll: FunctionCaller
declare var afterEach: FunctionCaller
declare var beforeEach: FunctionCaller

const afterAll_ = afterAll
const afterEach_ = afterEach
const beforeAll_ = beforeAll
const describe_ = describe
const expect_ = expect
const it_ = it
const beforeEach_ = beforeEach

export {
  afterAll_ as afterAll,
  afterEach_ as afterEach,
  beforeEach_ as beforeEach,
  beforeAll_ as beforeAll,
  describe_ as describe,
  expect_ as expect,
  it_ as it,
}

declare var global: any

export function mockRandomValues() {
  simple
    .mock(global.crypto, 'getRandomValues')
    .callFn(function(bytes: Uint8Array) {
      for (let i = 0; i < bytes.length; ++i) {
        bytes[i] = i
      }
    })
}

export function restore() {
  simple.restore()
}
