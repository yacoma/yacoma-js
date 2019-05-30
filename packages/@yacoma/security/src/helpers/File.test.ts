import * as crypt from '@yacoma/crypt'
import { UserWithKeys } from '../types'
import * as security from './'
import { binaryFileIdFromPayload, createFile, getFileBuffer } from './File'
import { isFileId } from './Item/makeId'
import { getItemKey } from './keys'

let currentUser: UserWithKeys
const quote =
  'Man suffers only because he takes seriously what the gods made for fun.'

describe('encryptBinaryFile', () => {
  beforeAll(async () => {
    const { user } = await security.createUser(['ukulele'])
    currentUser = user
  })

  it('should read and encrypt a File', async () => {
    const { encryptionKey } = await crypt.createEncryptionKey()
    const file = new File([quote], 'watts.txt', { type: 'text/plain' })
    const result = await security.encryptBinaryFile(
      currentUser.signKey,
      encryptionKey,
      file
    )

    const payload = result.payload
    delete result.payload
    const len = crypt.makeId().length
    expect(result.fileId.length).toBe(len)
    expect(result).toEqual({
      title: 'watts',
      fileExt: 'txt',
      fileId: binaryFileIdFromPayload(payload),
      fileType: 'text/plain',
      fileSize: 166,
    })

    const clear = await security.decryptBinaryFile(
      currentUser.id,
      encryptionKey,
      payload,
      result
    )
    expect(clear instanceof File).toBe(true)
    expect(clear.name).toBe(file.name)
    expect(clear.type).toBe(file.type)
    expect(clear.size).toBe(file.size)
    const fbuff = await getFileBuffer(file)
    const cbuff = await getFileBuffer(clear)
    expect(cbuff).toEqual(fbuff)

    const url = await security.decryptBinaryFileToUrl(
      currentUser.id,
      encryptionKey,
      payload
    )
    expect(url).toBe('data:*/*;base64,' + crypt.bufferToBase64(fbuff))
  })
})

describe('createFile', () => {
  beforeAll(async () => {
    const { user } = await security.createUser(['ukulele'])
    currentUser = user
  })

  it('create a file', async () => {
    const file = new File([quote], 'watts.txt', { type: 'text/plain' })
    const { raw, payload, content: acontent } = await createFile(
      currentUser,
      file
    )
    expect(raw.type).toBe('File')
    expect(isFileId(raw.id)).toBe(true)
    expect(typeof raw.fileId).toBe('string')
    expect(raw.fileBy).toBe(currentUser.id)
    expect(raw.fileSize).toBe(payload.byteLength)
    const itemKeys = await getItemKey(currentUser, raw)
    const { payload: content } = await crypt.decrypt(
      currentUser.id,
      itemKeys.encryptionKey,
      raw.content
    )
    expect(content).toEqual({
      fileId: raw.fileId,
      fileBy: currentUser.id,
      fileSize: payload.byteLength,
      fileType: 'text/plain',
      fileExt: 'txt',
      title: 'watts',
    })
    expect(acontent).toEqual(content)
  })
})
