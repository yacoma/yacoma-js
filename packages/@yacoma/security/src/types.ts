// This list must reflect the `type` field in Item
export const ITEM_TYPES: ItemTypes[] = [
  'Item',
  'Collection',
  'PairCollection',
  'PrivateCollection',
  'WorkCollection',
  'Contact',
  'Message',
  'File',
]

export const itemAccessValue = {
  admin: 'ae',
  editor: 'e',
}

export const collectionAccessValue = {
  admin: 'aer+-',
  editor: 'er+-',
  contributor: 'r+-',
  reader: 'r',
}

export interface Base {
  id: string
  type: string
  savedAt: string
}

export interface BaseUser extends Base {
  // True for admin users.
  admin?: boolean
  // This is inherited on user creation. It can only be
  // set through admin creation through cli.
  domain?: string
}

export interface RawUser extends Base {
  id: string
  type: 'User'
  savedAt: string
  // Encrypted with user's master key.
  privateKeys: string
  // Signed by user.
  publicKeys: string
  // Basic information
}

export interface User extends RawUser {
  username: string
  email?: string
  admin?: boolean
  domain: string
  protected?: boolean
}

export interface RawUserWithKeys {
  // Copy user.id and 'admin' here
  id: string
  admin?: boolean
  // During user creation from word list, domain
  // is not set before full login, hence the '?'
  domain?: string
  user: RawUser
  // Private sign key
  signKey: Uint8Array
  // Master key
  encryptionKey: CryptoKey
}

// User with all keys, including exportable keys.
export interface UserWithKeys extends RawUserWithKeys {
  // Private sign key as a string
  sign: string

  // Master key as a string (easy to export)
  encrypt: string

  // Collection encryption keys as strings
  collections: { [collId: string]: string }
  collectionKeys: { [collId: string]: CryptoKey }

  // Receive key (not encrypted)
  ecdhPriv: string
  ecdhPrivKey: CryptoKey

  // Public ecdh key
  ecdhPub: string
  ecdhPubKey: CryptoKey
}

export interface Session extends Base {
  id: string
  type: 'Session'
  savedAt: string
  userId: string
}

export interface AccessChangeLogEntry {
  // User who changed the access.
  changedBy: string
  // Operation details (signed JSON).
  // AccessChangeOperation
  operation: string
}

export interface AccessChangeOperation {
  // Changed timestamp.
  changedAt: number
  // Signature of previous operation. Contains itemId for first operation.
  previous: string
  // Type of access operation
  type: 'user' | 'collection'
  // Concerned field in 'userAccess' or 'collectionAccess'.
  id: string
  // Operation name.
  operation:
    | 'add' // Item.userAccess & Item.collectionAccess & Collection.collectionAccess(*)
    | 'update' // Item.userAccess
    | 'remove' // Item.userAccess & Item.collectionAccess
    | 'invite' // Collection.userAccess
    | 'join' // Collection.userAccess
  // (*) only on collection creation with `operation.id == self.id`
  // Changed access (for userAccess add and update. collectionAccess does not have this field)
  access?: string
}

export interface UserAccess {
  [userId: string]: {
    // A string which contains flags to allow granular access to the Item.
    // a: Admin (edit collectionAccess, userAccess, deleted).
    // e: Edit content field.
    access: string
  }
}

export interface UserAccessWithOperation {
  [userId: string]: {
    // A string which contains flags to allow granular access to the Item.
    // e: Edit content field.
    // a: Edit access (collectionAccess, userAccess, deleted).
    access?: string
    operation?: AccessChangeOperation
  }
}

export interface CollectionAccess {
  // Adding or removing a key here adds or removes a link to the remote Collection.
  [collId: string]: {
    // Who encrypted the itemKey for this collection.
    signedBy: string
    // Item encryption key encrypted with the collection key
    key: string
  }
}

export interface CollectionAccessWithOperation {
  // Adding or removing a key here adds or removes a link to the remote Collection.
  [collId: string]: {
    // Item encryption key encrypted with the collection key
    key?: string
    operation?: AccessChangeOperation
  }
}

export type ItemTypesWithoutMessage =
  | 'Item'
  | 'Collection'
  | 'PairCollection'
  | 'PrivateCollection'
  | 'WorkCollection'
  | 'Contact'
  | 'File'

export type ItemTypes = ItemTypesWithoutMessage | 'Message'

/** This contains all the fields that do not require stringification
 * when stored in database. This interface exists to ease creating
 * Item and ItemStringified.
 */
export interface ItemSimpleFields extends Base {
  id: string

  // This cannot be changed after creation. Different rules apply to different
  // security types.
  // This must reflect ITEM_TYPES
  type: ItemTypes

  // Mutate operation ISO timestamp, written by server.
  savedAt: string

  // Flag to show if the item was deleted.
  deleted: boolean

  // This must be current revision + 1.
  revision: number

  // User id of the initial author.
  creator: string
  // Creation timestamp in ISO format.
  createdAt: string

  // User id of the last person who edited the item content.
  editor: string
  // Edit timestamp in ISO format.
  editedAt: string

  // User id of the last person who edited access for this item.
  accessChangedBy: string
  // Access changed timestamp in ISO format.
  accessChangedAt: string

  // Encrypted JSON with item key, signed by editor.
  content: string

  // Signature of the item, signed by last modifier (editor or accessChangedBy).
  signature: string

  // Client only. Stores original values in case of sync conflict and
  // to date and sign the AccessChangeLog (dateAndSign during sync).
  original?: Item
}

export interface Item extends ItemSimpleFields {
  // This field is stored as JSON (not encrypted).
  // Changing this implies adding entries in accessChangeLog.
  // Item: in which collection the item is shared (contains itemKey encrypted with collectionKey).
  // Collection: not used = must be empty {}.
  collectionAccess: CollectionAccess

  // This field is stored as JSON (not encrypted).
  // Changing this implies adding entries in accessChangeLog.
  // Item: who can do what with an item.
  // Collection: to whom the collection is shared (contains the collectionKey encrypted by user).
  userAccess: UserAccess

  // Record access changes.
  accessChangeLog: AccessChangeLogEntry[]

  // Client only. Stores original values in case of sync conflict and
  // to date and sign the AccessChangeLog (dateAndSign during sync).
  original?: Item
}

export interface ItemStringified extends ItemSimpleFields {
  collectionAccess: string
  userAccess: string
  accessChangeLog: string

  // Client only. Stores original values in case of sync conflict and
  // to date and sign the AccessChangeLog (dateAndSign during sync).
  original?: Item
}

export interface Message extends Item {
  // No mutation allowed after creation.
  type: 'Message'
}

export interface Contact extends Item {
  type: 'Contact'
}

export interface FileItem extends Item {
  type: 'File'
  fileId: string
  fileBy: string
  fileSize: number
}

export interface CollectionUserAccess {
  [userId: string]: {
    // Collection key encrypted with user key (accepted invite).
    key?: string

    // When a collection is shared to another collection, we create invite entries for
    // all current users in the target collection that are not yet invited. The invite
    // field contains the collection key encrypted with the ECDH key (user privKey, sender pubKey).
    invite?: string

    // User id of the person who created the invite. We need this so that the
    // invite can be verified.
    invitedBy?: string

    // Public key of the user who sent the invite (with receiver's private key, this allows the
    // creation of the common key)
    pubKey?: string

    // Same flags as Item with extra flags:
    // r: Read (minimal access for collection): can download collection content, has key or invite
    // +: Add items to the collection (including messages)
    // -: Remove items from collection (cannot remove a message)
    access: string
  }
}

export interface Collection extends Item {
  type: 'Collection' | 'PairCollection' | 'WorkCollection' | 'PrivateCollection'

  // The Collection inherits all fields from Item with some changes to the
  // `userAccess` field.
  userAccess: CollectionUserAccess

  // Client only. Stores original values in case of sync conflict and
  // to date and sign the AccessChangeLog (dateAndSign during sync).
  original?: Collection
}

export interface PairCollection extends Collection {
  type: 'PairCollection'
  userAccess: {
    [userId: string]: {
      // Fixed access: cannot edit, cannot change sharing or users, can only add
      // and remove items.
      access: 'r+-'
    }
  }

  // Client only. Stores original values in case of sync conflict and
  // to date and sign the AccessChangeLog (dateAndSign during sync).
  original?: PairCollection
}

export type ValidateFunction = (
  context: Context
) => Promise<string | void> | string | void // string is the error

export interface ModelQuery<T = Item> {
  findOne(id: string): Promise<T | undefined>
}

export interface Context<T = any> {
  currentUser: BaseUser
  now: number
  file?: Uint8Array
  // The previous element data (Item, User, etc).
  oldRecord: T | undefined
  // The new element data (Item, User, etc).
  newRecord: T
}

export function isCollection(entity: { type: string }): entity is Collection {
  const type = entity.type as ItemTypes
  return (
    type === 'Collection' ||
    type === 'PairCollection' ||
    type === 'PrivateCollection' ||
    type === 'WorkCollection'
  )
}

export function isItem(entity: { type: string }): entity is Item {
  return ITEM_TYPES.includes(entity.type as any)
}

export function isUser(entity: { type: string }): entity is User {
  return entity.type === 'User'
}

export function isContact(entity: { type: string }): entity is Contact {
  return (entity.type as ItemTypes) === 'Contact'
}

export function isFile(entity: { type: string }): entity is FileItem {
  return (entity.type as ItemTypes) === 'File'
}

export function isWorkCollection(entity: {
  type: string
}): entity is Collection {
  return (entity.type as ItemTypes) === 'WorkCollection'
}

export function isPrivateCollection(entity: {
  type: string
}): entity is Collection {
  return (entity.type as ItemTypes) === 'PrivateCollection'
}

export function isAdmin({ admin }: { admin?: boolean }) {
  return admin === true
}

export function isProtected(entity: { protected?: boolean }) {
  return entity.protected === true
}
