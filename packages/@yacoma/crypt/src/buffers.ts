import { CRYPT_VERSION } from './types'

const SIZES = [4, 3, 2, 1]
const BASE_HEADER_SIZE = 3 /* version, encoding, count */

/** The buffer contains many buffers with varying lengths.
 * The first byte contains the number of bytes used to encode buffer lengths:
 * 1 = Uint8, 2 = UInt16, 3 = UInt32, 4 = UInt64
 * The second value contains the number of buffers (max 256 buffers) not including the last one.
 * The next values contain the lengths of the buffers (except the last one).
 *
 * Bytes for an example with 2 small buffers (16 and 32 bytes) and a large one.
 * [ 1, crypt version (major semver version)
 *   1, buffer sizes are encoded with UInt8
 *   number of buffers = 3,
 *   buffer 1 length = 16,
 *   buffer 2 length = 32,
 *   ... buffer 1 content (16 bytes),
 *   ... buffer 2 content (32 bytes),
 *   ... last buffer content (the rest of bytes),
 * ]
 *
 * Bytes for an example with 1 small buffer (16 bytes), a large one (500 bytes) and a last buffer.
 * [ 1, crypt version
 *   2, buffer sizes are encoded with two bytes
 *   number of buffers = 3,
 *   buffer 1 length % 256 = 16,
 *   buffer 1 length / 256 = 0,
 *   buffer 2 length % 256 = 244,
 *   buffer 2 length / 256 = 1,
 *   ... buffer 1 content (16 bytes),
 *   ... buffer 2 content (500 bytes),
 *   ... last buffer content (the rest of bytes),
 * ]
 */

export function getLengths(
  buffer: Uint8Array
): { lengths: number[]; offset: number } {
  const lengths: number[] = []
  let total = 0

  if (buffer.byteLength < BASE_HEADER_SIZE) {
    throw new Error(`Invalid buffer (buffer too small).`)
  }

  const version = buffer[0]
  if (version !== CRYPT_VERSION) {
    throw new Error(
      `Invalid buffer (crypt version v${version}, expecting v${CRYPT_VERSION}).`
    )
  }

  // Number of bytes used to encode sizes
  const lenSize = buffer[1]
  if (lenSize > 4) {
    throw new Error(`Invalid buffer (invalid size encoding).`)
  }
  // Number of buffers (not including the last one)
  const count = buffer[2]

  const offset = BASE_HEADER_SIZE + count * lenSize
  if (offset > buffer.byteLength) {
    throw new Error(`Invalid buffer (invalid buffer count).`)
  }

  for (let bufIdx = 0; bufIdx < count; ++bufIdx) {
    let len = 0
    for (let i = 0; i < lenSize; ++i) {
      len +=
        Math.pow(2, i * 8) * buffer[BASE_HEADER_SIZE + bufIdx * lenSize + i]
    }
    total += len
    lengths.push(len)
  }
  const rest =
    buffer.byteLength -
    BASE_HEADER_SIZE -
    count * lenSize /* lengths count */ -
    total

  if (rest < 0) {
    throw new Error(`Invalid buffer (invalid buffer size).`)
  }
  lengths.push(rest)

  return { lengths, offset }
}

export function getBuffers(
  buffer: Uint8Array
): { buffers: Uint8Array[]; offset: number } {
  const { lengths, offset } = getLengths(buffer)
  let start = offset
  const storage = buffer.buffer
  const buffers = lengths.map(len => {
    // no copy
    const buff = new Uint8Array(storage, start, len)
    start += len
    return buff
  })
  return { buffers, offset }
}

export function getBuffer(
  buffers: Uint8Array[]
): { buffer: Uint8Array; offset: number } {
  const lengths = buffers.map(buf => buf.byteLength)
  if (buffers.length === 0) {
    throw new Error(`Cannot build buffer (empty buffers list).`)
  }
  // Remove last buffer length (which can be large)
  const lastLength = lengths.pop()
  const count = lengths.length

  const maxLen = Math.max(...lengths)

  const lenSize =
    SIZES.find(len => Math.floor(maxLen / Math.pow(2, 8 * (len - 1))) > 0) || 1

  const headerLength = BASE_HEADER_SIZE + count * lenSize
  const totalLength = lengths.reduce(
    (len, acc) => acc + len,
    headerLength + lastLength!
  )
  const buffer = new Uint8Array(totalLength)

  // Set header
  const header = [CRYPT_VERSION, lenSize, lengths.length]

  // Set sizes
  lengths.forEach(len => {
    let l = len
    for (let i = 0; i < lenSize; ++i) {
      const stepSize = Math.pow(2, 8 * i)
      const nextSize = Math.pow(2, 8 * (i + 1))
      const val = l % nextSize
      l -= val
      header.push(val / stepSize)
    }
  })
  buffer.set(header, 0)

  const startOffset = header.length

  let offset = startOffset
  buffers.forEach(buf => {
    buffer.set(buf, offset)
    offset += buf.byteLength
  })

  return { buffer, offset: startOffset }
}
