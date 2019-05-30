import * as crypt from '@lucidogen/crypt'
import { describe, expect, it } from 'test'
import { binaryFileIdFromPayload, userFromWordList } from '../../helpers'
import { BaseUser, FileItem } from '../../types'
import * as validate from './'

const currentUser = {
  id: 'userId',
} as BaseUser
const now: number = Date.now()

describe('File info', () => {
  it('should match file', async () => {
    const user = await userFromWordList(['lazy', 'dog'])
    const currentUser = user.user
    const user2 = await userFromWordList(['lazy', 'cat'])
    const file = await crypt.encryptBinary(
      user.signKey,
      user.encryptionKey,
      new Uint8Array([1, 2, 3, 4, 5])
    )
    const fileId = binaryFileIdFromPayload(file)
    const fileSize = file.byteLength
    const fileBy = user.id
    expect(
      await validate.fileInfo({
        now,
        currentUser,
        file,
        oldRecord: undefined,
        newRecord: { type: 'File', fileId, fileBy, fileSize } as any,
      })
    ).toBe(undefined)

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        file,
        oldRecord: undefined,
        newRecord: { type: 'File', fileId: 'otherId', fileBy, fileSize } as any,
      })
    ).toBe(`fileId: does not match file payload`)

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        file,
        oldRecord: undefined,
        newRecord: { type: 'File', fileId, fileBy: 'fooofof', fileSize } as any,
      })
    ).toBe(`fileBy: should be current user on file change`)

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        file,
        oldRecord: undefined,
        newRecord: { type: 'File', fileId, fileBy, fileSize: 23 } as any,
      })
    ).toBe(`fileSize: does not match file payload`)

    expect(
      await validate.fileInfo({
        now,
        currentUser: user2.user,
        file,
        oldRecord: undefined,
        newRecord: { type: 'File', fileId, fileBy, fileSize } as any,
      })
    ).toBe(`file: invalid signature`)
  })

  it('should not change without file', async () => {
    const oldRecord = {
      fileId: 'someFileId',
      fileBy: 'somebody',
      fileSize: 123456,
    } as FileItem
    expect(
      await validate.fileInfo({
        now,
        currentUser,
        oldRecord,
        newRecord: oldRecord,
      })
    ).toBe(undefined)

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        oldRecord,
        newRecord: Object.assign({}, oldRecord, { fileId: 'otherId' }),
      })
    ).toBe('fileId: should not change without a file change')

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        oldRecord,
        newRecord: Object.assign({}, oldRecord, { fileBy: 'otherPerson' }),
      })
    ).toBe('fileBy: should not change without a file change')

    expect(
      await validate.fileInfo({
        now,
        currentUser,
        oldRecord,
        newRecord: Object.assign({}, oldRecord, { fileSize: 45 }),
      })
    ).toBe('fileSize: should not change without a file change')
  })
})
