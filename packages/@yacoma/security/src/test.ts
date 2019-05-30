import * as simple from 'simple-mock'
import { makeId } from '@yacoma/crypt'

export async function throwMessage(fn: () => void) {
  let error = 'did not throw'
  try {
    await fn()
  } catch (e) {
    error = e.message
  }
  return error
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

export function userId(): string {
  return makeId(32)
}
