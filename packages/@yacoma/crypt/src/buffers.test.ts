import { describe, expect, it } from 'test'
import { getLengths, getBuffers, getBuffer } from './buffers'
import { nativeToBuffer, bufferToNative } from './encoding'
import { CRYPT_VERSION } from './types'

const buffer = Uint8Array.from([
  CRYPT_VERSION,
  1 /* buffer sizes encoded in 1 byte */,
  3 /* 3 buffers */,
  16 /* buffer 1 length */,
  18 /* buffer 2 length */,
  12 /* buffer 3 length */,
  ...Array.from({ length: 16 }).map(() => 1),
  ...Array.from({ length: 18 }).map(() => 2),
  ...Array.from({ length: 12 }).map(() => 3),
  ...Array.from({ length: 10 }).map(() => 4),
])

const largeBuffer = Uint8Array.from([
  CRYPT_VERSION,
  2 /* buffer sizes encoded in 2 bytes */,
  3 /* 3 buffers */,
  16 /* buffer 1 length */,
  0 /* buffer 1 length */,
  244 /* buffer 2 length (500) */,
  1 /* buffer 2 length */,
  12 /* buffer 3 length */,
  0 /* buffer 3 length */,
  ...Array.from({ length: 16 }).map(() => 1),
  ...Array.from({ length: 500 }).map(() => 2),
  ...Array.from({ length: 12 }).map(() => 3),
  ...Array.from({ length: 10 }).map(() => 4),
])

describe('getLengths', () => {
  it('should throw on invalid buffer size', () => {
    let error = 'did not throw'
    try {
      getLengths(
        new Uint8Array([0, 0])
      ) /* too small for all base header values */
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(`Invalid buffer (buffer too small).`)
  })

  it('should throw on invalid crypt version', () => {
    let error = 'did not throw'
    try {
      getLengths(new Uint8Array([CRYPT_VERSION + 1, 0, 0]))
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(
      `Invalid buffer (crypt version v${CRYPT_VERSION +
        1}, expecting v${CRYPT_VERSION}).`
    )
  })

  it('it should read lengths from buffer', async () => {
    expect(getLengths(buffer)).toEqual({
      lengths: [16, 18, 12, 10],
      offset: 3 + 3 * 1,
    })
  })

  it('it should read large lengths from buffer', async () => {
    expect(getLengths(largeBuffer)).toEqual({
      lengths: [16, 500, 12, 10],
      offset: 3 + 3 * 2,
    })
  })
})

describe('getBuffer', () => {
  it('it should concat buffers', async () => {
    const buffers = getBuffers(buffer)
    expect(buffers.offset).toBe(3 + 3)
    expect(
      getBuffer(buffers.buffers)
        .buffer.map(n => n)
        .join('')
    ).toEqual(
      [
        CRYPT_VERSION,
        1 /* nb of bytes to encode size */,
        3 /* nb of buffers (without last one) */,
        16 /* sizes */,
        18,
        12,
        ...Array.from({ length: 16 }).map(() => 1),
        ...Array.from({ length: 18 }).map(() => 2),
        ...Array.from({ length: 12 }).map(() => 3),
        ...Array.from({ length: 10 }).map(() => 4),
      ].join('')
    )
  })

  it('it should concat large buffers', async () => {
    const buffers = getBuffers(largeBuffer)
    expect(
      getBuffer(buffers.buffers)
        .buffer.map(n => n)
        .join('')
    ).toEqual(
      [
        CRYPT_VERSION,
        2 /* nb of bytes to encode size */,
        3 /* nb of buffers (without last one) */,
        16 /* sizes */,
        0,
        244,
        1,
        12,
        0,
        ...Array.from({ length: 16 }).map(() => 1),
        ...Array.from({ length: 500 }).map(() => 2),
        ...Array.from({ length: 12 }).map(() => 3),
        ...Array.from({ length: 10 }).map(() => 4),
      ].join('')
    )
  })

  it('should store stuff', () => {
    const values = ['this and that', { one: 'two', four: 'five' }, 3456]
    const { buffer } = getBuffer(values.map(nativeToBuffer))
    const { buffers } = getBuffers(buffer)
    expect(buffers.map(bufferToNative)).toEqual(values)
  })

  it('should throw on empty buffers list', () => {
    let error = 'did not throw'
    try {
      getBuffer([])
    } catch (e) {
      error = e.message
    }
    expect(error).toBe(`Cannot build buffer (empty buffers list).`)
  })

  it('should build buffer with one empty buffer', () => {
    expect(getBuffer([new Uint8Array()])).toEqual({
      buffer: new Uint8Array([
        CRYPT_VERSION,
        1 /* length encoding */,
        0 /* buffer count */,
      ]),
      offset: 3,
    })
  })

  it('should build buffer with multiple empty buffers', () => {
    expect(getBuffer([new Uint8Array(), new Uint8Array()])).toEqual({
      buffer: new Uint8Array([
        CRYPT_VERSION,
        1 /* length encoding */,
        1 /* buffer count */,
        0 /* buffer 1 size */,
      ]),
      offset: 4,
    })
  })
})

describe('getBuffers', () => {
  it('it should extract buffers', async () => {
    const { buffers, offset } = getBuffers(buffer)
    expect(offset).toBe(3 + 3 * 1)
    expect(buffers.map(buff => buff.map(n => n).join(''))).toEqual([
      Array.from({ length: 16 })
        .map(() => 1)
        .join(''),
      Array.from({ length: 18 })
        .map(() => 2)
        .join(''),
      Array.from({ length: 12 })
        .map(() => 3)
        .join(''),
      Array.from({ length: 10 })
        .map(() => 4)
        .join(''),
    ])
  })

  it('it should extract large buffers', async () => {
    const { buffers, offset } = getBuffers(largeBuffer)
    expect(offset).toBe(3 + 3 * 2)
    expect(buffers.map(buff => buff.map(n => n).join(''))).toEqual([
      Array.from({ length: 16 })
        .map(() => 1)
        .join(''),
      Array.from({ length: 500 })
        .map(() => 2)
        .join(''),
      Array.from({ length: 12 })
        .map(() => 3)
        .join(''),
      Array.from({ length: 10 })
        .map(() => 4)
        .join(''),
    ])
  })

  it('should throw on invalid len size', () => {
    const buffer = new Uint8Array([
      CRYPT_VERSION,
      5 /* 1 byte size encoding */,
      0,
    ])
    let error = 'did not throw'
    try {
      getBuffers(buffer)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('Invalid buffer (invalid size encoding).')
  })

  it('should throw on invalid sizes count', () => {
    const buffer = new Uint8Array([
      CRYPT_VERSION,
      1 /* 1 byte size encoding */,
      15 /* 15 buffers */,
      0,
      0,
      0,
      0,
      0,
      0 /* not enough sizes */,
    ])
    let error = 'did not throw'
    try {
      getBuffers(buffer)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('Invalid buffer (invalid buffer count).')
  })

  it('should throw on invalid buffer size', () => {
    const buffer = new Uint8Array([
      CRYPT_VERSION,
      1 /* 1 byte size encoding */,
      1 /* buffer count */,
      8 /* buffer1 size */,
      0 /* not enough bytes */,
      0,
    ])
    let error = 'did not throw'
    try {
      getBuffers(buffer)
    } catch (e) {
      error = e.message
    }
    expect(error).toBe('Invalid buffer (invalid buffer size).')
  })

  it('should not throw on empty buffer size', () => {
    const buffer = new Uint8Array([
      CRYPT_VERSION,
      1 /* 1 byte size encoding */,
      2 /* buffer count */,
      0 /* buffer1 size */,
      0 /* buffer2 size */,
    ])
    const { buffers } = getBuffers(buffer)
    expect(buffers.map(buff => buff.byteLength)).toEqual([0, 0, 0])
  })
})
