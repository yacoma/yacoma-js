import simple from 'simple-mock'

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
