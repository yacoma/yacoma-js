import { makeId } from '@lucidogen/crypt'
import { ItemTypes } from '../../types'

/** Prefix:
 * ''  // no prefix: user id
 * 'i' // Item
 * 'a' // Contact
 * 'm' // Message
 * 'f' // File
 * 'c' // Collection
 * 'd' // duo (pair) collection (derived from the two userIds)
 * 'p' // Private collection (derived from userId)
 * 'w' // Work collection (student study space: derived from userId)
 */
function createId(prefix: string): string {
  return `${prefix}.${makeId(33)}`
}

function addPrefix(id: string, prefix: string): string {
  return `${prefix}.${id}`
}

export function itemId(): string {
  return createId('i')
}

export function messageId(): string {
  return createId('m')
}

export function fileId(): string {
  return createId('f')
}

export function collectionId(): string {
  return createId('c')
}

export function pairCollectionId(userId: string, otherUserId: string) {
  return `d.${[userId, otherUserId]
    .sort()
    .map(id => id.slice(0, 22))
    .join('')}`
}

export function privateCollectionId(userId: string): string {
  if (userId.charAt(1) === '.') {
    throw new Error('PrivateCollectionId can only be created from userId.')
  }
  return addPrefix(userId, 'p')
}

export function contactId(userId: string): string {
  if (userId.charAt(1) === '.') {
    throw new Error('ContactId can only be created from userId.')
  }
  return addPrefix(userId, 'a')
}

export function isPrivateCollectionId(id: string): boolean {
  return id.slice(0, 2) === 'p.'
}

export function isWorkCollectionId(id: string): boolean {
  return id.slice(0, 2) === 'w.'
}

export function isPairCollectionId(id: string): boolean {
  return id.slice(0, 2) === 'd.'
}

export function isContactId(id: string): boolean {
  return id.slice(0, 2) === 'a.'
}

export function isFileId(id: string): boolean {
  return id.slice(0, 2) === 'f.'
}

export function isMessageId(id: string): boolean {
  return id.slice(0, 2) === 'm.'
}

export function isCollectionId(id: string): boolean {
  return (
    isPairCollectionId(id) ||
    isWorkCollectionId(id) ||
    isPrivateCollectionId(id) ||
    id.slice(0, 2) === 'c.'
  )
}

export function workCollectionId(userId: string): string {
  if (userId.charAt(1) === '.') {
    throw new Error('WorkCollectionId can only be created from userId.')
  }
  return addPrefix(userId, 'w')
}

export function extractUserId(id: string): string {
  if (isPrivateCollectionId(id) || isWorkCollectionId(id) || isContactId(id)) {
    return id.slice(2)
  }
  throw new Error(
    'UserId can only be extracted from privateCollectionId or workCollectionId.'
  )
}

export function extractIdAndPrefix(
  id: string
): { userId: string; prefix: string } {
  if (id.charAt(1) !== '.') {
    return { userId: id, prefix: '' }
  }
  return { userId: id.slice(2), prefix: id.slice(0, 1) }
}

const PREFIX_TO_TYPE: { [key: string]: ItemTypes } = {
  i: 'Item',
  a: 'Contact',
  f: 'File',
  m: 'Message',
  c: 'Collection',
  d: 'PairCollection',
  p: 'PrivateCollection',
  w: 'WorkCollection',
}

export function typeFromId(id: string): ItemTypes {
  const { prefix } = extractIdAndPrefix(id)
  if (!prefix) {
    throw new Error(`Cannot get prefix from id: ${id}.`)
  }
  return PREFIX_TO_TYPE[prefix]
}

const ID_FOR_TYPE: { [key: string]: () => string } = {
  Item: itemId,
  File: fileId,
  Message: messageId,
  Collection: collectionId,
}

export function idForType(type: ItemTypes): string {
  const makeIdForType = ID_FOR_TYPE[type]
  if (!makeIdForType) {
    throw new Error(`Cannot create id without arguments for type ${type}.`)
  }
  return makeIdForType()
}
