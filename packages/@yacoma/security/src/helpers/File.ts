import * as crypt from '@lucidogen/crypt'
import { createEncryptionKey, extractHeader } from '@lucidogen/crypt'
import { FileItem, UserWithKeys } from '../types'
import { createItem, setContent } from './Item'
import { fileId } from './Item/makeId'
import { getItemKey } from './keys'

const NAME_RE = /^(.+)\.(.+)$/

interface EncryptFileResult {
  title: string
  fileId: string
  fileExt: string
  fileSize: number
  fileType: string
  payload: Uint8Array
}

export function binaryFileIdFromPayload(payload: Uint8Array): string {
  const { signature } = extractHeader(payload)
  return crypt.bufferToBase64url(signature).slice(0, 44)
}

export async function getFileBuffer(file: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      if (!fr.result) {
        reject(new Error(`Could not read file.`))
      }
      resolve(new Uint8Array(fr.result as ArrayBuffer))
    }
    fr.readAsArrayBuffer(file)
  })
}

function extractFileInfo(file: File, payload?: Uint8Array, fileId?: string) {
  const name = NAME_RE.exec(file.name) || [file.name, '']
  return {
    title: name[1],
    // Make sure the fileId can be extracted from the binary file
    // as this is used on server after signature verification.
    fileId: payload ? binaryFileIdFromPayload(payload) : fileId || 'none',
    fileSize: payload ? payload.byteLength : file.size,
    fileExt: name[2],
    fileType: file.type,
  }
}

export async function encryptBinaryFile(
  signKey: Uint8Array | string,
  itemKey: CryptoKey,
  file: File
): Promise<EncryptFileResult> {
  const buffer = await getFileBuffer(file)
  const payload = await crypt.encryptBinary(signKey, itemKey, buffer)
  return Object.assign({ payload }, extractFileInfo(file, payload))
}

export async function decryptBinaryFile(
  verifyKey: Uint8Array | string,
  itemKey: CryptoKey,
  cipher: Uint8Array,
  info: { title: string; fileType: string; fileExt: string }
): Promise<File> {
  const { payload } = await crypt.decryptBinary(verifyKey, itemKey, cipher)
  const name =
    info.fileExt !== '' ? `${info.title}.${info.fileExt}` : info.title
  return new File([payload], name, { type: info.fileType })
}

export async function decryptBinaryFileToUrl(
  verifyKey: Uint8Array | string,
  itemKey: CryptoKey,
  cipher: Uint8Array
): Promise<string> {
  const { payload } = await crypt.decryptBinary(verifyKey, itemKey, cipher)
  return 'data:*/*;base64,' + crypt.bufferToBase64(payload)
}

/** We let users create file items in two steps: first a dummy and
 * then the real item because parsing and encrypting a file can take time and we
 * do not want to wait before showing an item in the interface.
 *
 * The dummy has invalid 'fileId' and 'fileSize'. If these fields are used, cleanup
 * should be made with final versions.
 */
export async function createFileDummy(
  currentUser: UserWithKeys,
  file: File,
  extraContent?: { [key: string]: any },
  // Used to create an Item directly in a Collection (not used to create Collections themselves)
  collectionId?: string
): Promise<{
  raw: FileItem
  content: { title: string; [key: string]: any }
}> {
  const itemKeys = await createEncryptionKey()
  const id = fileId()

  const fileInfo = extractFileInfo(file, undefined, id)

  const content = Object.assign({}, extraContent || {}, fileInfo, {
    // Make sure we do not overwrite title
    title: (extraContent && extraContent.title) || fileInfo.title,
    fileBy: currentUser.id,
  })
  delete content.file

  const item = await createItem<FileItem>(
    currentUser,
    {
      id,
      type: 'File',
      fileId: fileInfo.fileId,
      fileBy: currentUser.id,
      fileSize: fileInfo.fileSize,
    },
    content,
    collectionId,
    itemKeys
  )

  return { raw: item, content }
}

export async function createFileFromDummy(
  currentUser: UserWithKeys,
  dummy: FileItem,
  file: File,
  extraContent: { [key: string]: any }
): Promise<{
  raw: FileItem
  payload: Uint8Array
  content: { title: string; [key: string]: any }
}> {
  const itemKeys = await getItemKey(currentUser, dummy)

  const efile = await encryptBinaryFile(
    currentUser.signKey,
    itemKeys.encryptionKey,
    file
  )

  const payload = efile.payload
  delete efile.payload

  const content = Object.assign({}, extraContent, efile, {
    title: (extraContent && extraContent.title) || efile.title,
    fileBy: currentUser.id,
  })
  // 'file' can exist in content for upload purposes.
  delete content.file
  await setContent(currentUser, dummy, content)
  dummy.fileId = efile.fileId
  dummy.fileBy = currentUser.id
  dummy.fileSize = efile.fileSize

  return { raw: dummy, content, payload }
}

export async function createFile(
  currentUser: UserWithKeys,
  file: File,
  extraContent?: { [key: string]: any },
  // Used to create an Item directly in a Collection (not used to create Collections themselves)
  collectionId?: string
): Promise<{
  raw: FileItem
  payload: Uint8Array
  content: { title: string; [key: string]: any }
}> {
  const { raw, content } = await createFileDummy(
    currentUser,
    file,
    extraContent,
    collectionId
  )
  return createFileFromDummy(currentUser, raw, file, content)
}
