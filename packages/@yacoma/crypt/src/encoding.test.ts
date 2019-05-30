import { describe, expect, it } from 'test'

import * as encode from './encoding'

describe('nativeToBuffer', () => {
  it('should encode object', () => {
    const obj = { hello: 'world' }
    expect(encode.bufferToNative(encode.nativeToBuffer(obj))).toEqual(obj)
  })

  it('should encode number', () => {
    const obj = 1234
    expect(encode.bufferToNative(encode.nativeToBuffer(obj))).toEqual(obj)
  })
})

describe('bufferToBase64', () => {
  it('should encode buffer', () => {
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer)
    expect(
      new Uint8Array(encode.base64ToBuffer(encode.bufferToBase64(buffer)))
    ).toEqual(buffer)
  })
})

describe('bufferToBase64url', () => {
  it('should encode buffer', () => {
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer)
    expect(
      new Uint8Array(encode.base64urlToBuffer(encode.bufferToBase64url(buffer)))
    ).toEqual(buffer)
  })
})

describe('hash', () => {
  it('should hash a string', async () => {
    const hashBuffer = await encode.hash('Some string')
    expect(encode.bufferToBase64(hashBuffer)).toEqual(
      'K+rwVI53DEw5IZbg7I59bYHMkoCsnH8zI+TGq8Ix6Vo='
    )
  })

  it('should hash a buffer', async () => {
    const hashBuffer = await encode.hash(new Uint8Array([1, 2, 3, 4, 5, 6]))
    expect(encode.bufferToBase64(hashBuffer)).toEqual(
      'K+rwVI53DEw5IZbg7I59bYHMkoCsnH8zI+TGq8Ix6Vo='
    )
  })
})
