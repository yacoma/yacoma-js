import * as allHelpers from './helpers'
import * as CollectionValidations from './type/Collection'
import * as ContactValidations from './type/Contact'
import * as FileValidations from './type/File'
import * as ItemValidations from './type/Item'
import * as MessageValidations from './type/Message'
import * as PairCollectionValidations from './type/PairCollection'
import * as PrivateCollectionValidations from './type/PrivateCollection'
import * as SessionValidations from './type/Session'
import * as UserValidations from './type/User'
import * as WorkCollectionValidations from './type/WorkCollection'
import { Base, Context, ValidateFunction } from './types'

export * from './helpers/Collection'
export * from './helpers/Contact'
export * from './helpers/File'
export * from './helpers/Item/create'
export * from './helpers/Item/dateAndSign'
export { getAccessChanges } from './helpers/Item/dateAndSign'
export * from './helpers/Item/makeId'
export * from './helpers/Item/setCollectionAccess'
export * from './helpers/Item/setContent'
export * from './helpers/Item/setDeleted'
export * from './helpers/Item/setUserAccess'
export * from './helpers/Item/signature'
export * from './helpers/Item/stringify'
export * from './helpers/keys'
export * from './helpers/sharing'
export { remoteNow, setRemoteNow } from './helpers/time'
export * from './helpers/User'
export { randomWords, WORD_COUNT } from './randomWords'
export {
  Base,
  Collection,
  collectionAccessValue,
  FileItem,
  isAdmin,
  isCollection,
  isContact,
  isItem,
  isPrivateCollection,
  isProtected,
  isUser,
  isWorkCollection,
  Item,
  itemAccessValue,
  ItemStringified,
  ItemTypes,
  ItemTypesWithoutMessage,
  Message,
  PairCollection,
  RawUser,
  RawUserWithKeys,
  User,
  UserWithKeys,
} from './types'

export const helper = allHelpers

const VALIDATORS: { [key: string]: { [key: string]: ValidateFunction } } = {
  Collection: CollectionValidations,
  Contact: ContactValidations,
  File: FileValidations,
  Item: ItemValidations,
  Message: MessageValidations,
  PairCollection: PairCollectionValidations,
  PrivateCollection: PrivateCollectionValidations,
  Session: SessionValidations,
  User: UserValidations,
  WorkCollection: WorkCollectionValidations,
}

/** Returns the list of errors (empty list if no errors).
 */
export async function validateMutation<T extends Base>(
  currentUser: Base,
  ctx: { now: number; file?: Uint8Array },
  oldRecord: T,
  newRecord: T
): Promise<string[]> {
  const context: Context<T> = {
    currentUser,
    now: ctx.now,
    file: ctx.file,
    oldRecord,
    newRecord,
  }
  const authenticated = currentUser && typeof currentUser.id === 'string'
  // User not logged in and not creating new user or session
  if (!authenticated) {
    return [`You are not logged in.`]
  } else {
    const validator = VALIDATORS[newRecord.type]
    // start transaction
    const errors: string[] = await Promise.all(
      Object.keys(validator).map(fnName => {
        const fn: ValidateFunction = validator[fnName]
        return fn(context)
      })
    ).then(results => results.filter(err => err !== undefined) as string[])
    return errors
  }
}
