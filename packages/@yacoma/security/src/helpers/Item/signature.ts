import * as crypt from '@lucidogen/crypt'
import { FileItem, Item } from '../../types'

const VERSIONS: { [key: string]: (keyof FileItem)[] } = {
  [1]: [
    'id', // <<=== ANY VERSION MUST CONTAIN 'id' and 'revision' at least.
    'revision',
    'type',
    'creator',
    'createdAt',
    'editor',
    'editedAt',
    'accessChangedAt',
    'accessChangedBy',
    // Might need to remove 'userAccess' from signature as keys are already signed
    // by giver and we might move 'userAccess' to separate table (some massively
    // shared collections would have a huge field here with all keys and it is not
    // useful for end user (only needs own user key and list of users)). Same reason
    // we should implement content versions instead of accessChangeLog...
    // 'userAccess',
    // We also remove 'collectionAccess' as we might move this outside of table and
    // we do not want to break all signatures if we do this. Sharing is signed in this
    // field already.
    // 'collectionAccess',
    'content',
    'fileBy',
    'fileId',
    'fileSize',
  ], // keys
}

const SIGNATURE_VERSION = 1

function serializeItem(
  item: Partial<Item> & { [key: string]: any },
  signatureVersion: number
) {
  return JSON.stringify(
    Object.assign(
      {},
      ...VERSIONS[signatureVersion].map(key => {
        const value = item[key]
        // We do not stringify 'undefined' or 'null' values so that new fields can be
        // added without changing item signature.
        return value === undefined || value === null ? {} : { [key]: value }
      })
    )
  )
}

export const getSignature = async (
  signKey: string | Uint8Array,
  item: Item
) => {
  return crypt.getSignature(
    signKey,
    serializeItem(item, SIGNATURE_VERSION),
    SIGNATURE_VERSION
  )
}

export function verifySignature(item: Item, signature: string) {
  const buffer = crypt.base64ToBuffer(signature)
  const { headers: signatureVersion } = crypt.extractHeader(buffer)
  const signedBy =
    item.accessChangedBy > item.accessChangedBy
      ? item.accessChangedBy
      : item.editor
  crypt.verifySignature(signedBy, serializeItem(item, signatureVersion), buffer)
}
