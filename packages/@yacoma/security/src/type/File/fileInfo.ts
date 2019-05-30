import * as crypt from '@yacoma/crypt'
import { binaryFileIdFromPayload } from '../../helpers'
import { Context, FileItem } from '../../types'

const FILE_KEYS: (keyof FileItem)[] = ['fileId', 'fileBy', 'fileSize']

export async function fileInfo({
  oldRecord,
  newRecord,
  currentUser,
  file,
}: Context<FileItem>): Promise<string | void> {
  if (file) {
    // TODO: is there a way to verify signature without loading full file in
    // memory ?
    try {
      // This would blow if the fileSize is not correct
      crypt.verifyBinary(currentUser.id, file)
    } catch (e) {
      return `file: invalid signature`
    }
    const fileId = await binaryFileIdFromPayload(file)
    if (newRecord.fileId !== fileId) {
      return `fileId: does not match file payload`
    }
    const fileSize = file.byteLength
    if (newRecord.fileSize !== fileSize) {
      return `fileSize: does not match file payload`
    }
    if (newRecord.fileBy !== currentUser.id) {
      return `fileBy: should be current user on file change`
    }
  } else if (oldRecord) {
    for (let key of FILE_KEYS) {
      if (newRecord[key] !== oldRecord[key]) {
        return `${key}: should not change without a file change`
      }
    }
  }
}
