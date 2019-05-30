import {
  Base,
  Collection as RawCollection,
  isCollection as isRawCollection,
  Item as RawItem,
  PairCollection as RawPairCollection,
  User,
} from '@yacoma/security'

// Types extracted on the client 'db' fields.

export interface Item extends Base {
  // Internal during save operations
  $saving?: true

  type: RawItem['type']
  title: string
  $changed?: boolean
  raw: RawItem
}

export interface Contact extends Item {
  type: 'Contact'
  user: User
}

export interface Collection extends Item {
  type: RawCollection['type']
  title: string
  raw: RawCollection
}

export interface WorkCollection extends Collection {
  type: 'WorkCollection'
  user: User
}

export interface PairCollection extends Collection {
  type: 'PairCollection'
  raw: RawPairCollection
  // Temporary fields for PairCollections that are not yet created.
  $unsaved?: boolean
  $user?: User
}

// Should be compatible with AttachmentType from 'chat'
export interface AttachmentType {
  // Icon to display attachment
  // icon?: string

  // Internal document
  id?: string

  // Paragraph on internal document
  // paragraphId?: string

  // Document title / title above paragraph
  // This title is computed in dragStart if it is missing (to avoid computing previous
  // title in every rendered paragraph).
  // title: string

  // External link
  // url?: string
}

export interface Message extends Item {
  type: 'Message'
  star?: boolean
  attachments?: {
    [attachIdx: string]: AttachmentType
  }
}

export interface FileItem extends Item {
  type: 'File'
  // Not stored. While upload is in progress, stores the percent of upload
  // done.
  $uploaded?: number
  // Sent to remote but not stored in object. This exists while an upload is
  // in progress.
  file?: Uint8Array
  // Specific to file, stored in 'content'
  fileExt: string
  fileType: string

  // ==== The following fields are stored in clear in RawItem
  // The remote file on server is cdn/fileBy/fileId (computed from signature)
  fileId: string
  // Who uploaded the data (and signed it)
  fileBy: string
  // The compressed, encrypted and signed size in bytes
  fileSize: string
}

export function isCollection(item: Item): item is Collection {
  return isRawCollection(item.raw)
}

export function isMessage(item: Item): item is Message {
  return item.type === 'Message'
}

export function isContact(item: Item): item is Contact {
  return item.type === 'Contact'
}

export function isFile(item: Item): item is FileItem {
  return item.type === 'File'
}

export function isWorkCollection(item: Item): item is WorkCollection {
  return item.type === 'WorkCollection'
}

export function isPairCollection(item: Item): item is PairCollection {
  return item.type === 'PairCollection'
}

/** Extract content from an item without the extra fields.
 */
export function contentFromItem(
  item: Item
): { title: string /* contains title at least */ } {
  const content = Object.assign({}, item as FileItem)
  delete content.$changed
  delete content.raw
  delete content.$uploaded
  delete content.$saving
  delete content.id
  delete content.type
  delete content.savedAt
  delete content.file
  return content
}

/** Make an item from a raw item and decrypted content
 */
export function itemFromContent(
  raw: RawItem,
  content: { title: string } // should at least contain title
): Item {
  return Object.assign({}, content, {
    raw,
    title: content.title,
    id: raw.id,
    type: raw.type,
    savedAt: raw.savedAt,
  })
}
