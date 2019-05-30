import { IContext } from 'overmind'
import { Base, User } from '@yacoma/security'
import * as actions from './actions'
import { Config, Context, Derive } from './app'
import {
  Collection,
  Contact,
  FileItem,
  Item,
  Message,
  PairCollection,
  WorkCollection,
} from './dataTypes'
import * as helpers from './helpers'

export interface ItemCallback<T> {
  (item: T): void
}

export interface AccessChanges {
  // The message to add when sharing to new people
  message?: string
  userAccess: {
    // false is set to remove userAccess entry
    [userId: string]: 'a' | 'e' | false
  }
  collectionAccess: {
    // True = keep or give access
    // False = remove access
    [collId: string]: boolean
  }
}

export interface BaseDataEffects {
  skipInit: boolean
  registerCallbacks(ctx: Context, app: IContext<Config>): void

  // Authentication
  // Registration disabled for now until we decide how it should
  // work for places where any user can create a login.
  register(ctx: Context): Promise<Contact | null>

  createContact(ctx: Context): Promise<Contact | null>

  login(ctx: Context): Promise<User | 'offline' | null>
  logout(ctx: Context): Promise<null>
  autoLogin(ctx: Context): Promise<User | 'offline' | null>

  // Query and subscribe
  query<T extends Base>(ctx: {}, type: string, variables?: any): Promise<T[]>
  subscribe(ctx: Context, type: string, variables?: any): void

  createPairCollection(ctx: Context, otherUser: User): Promise<Collection>
  createItem(
    ctx: Context,
    type: 'Item' | 'Collection' | 'File',
    content?: { [key: string]: any },
    opts?: { file?: File; collectionId?: string; open?: boolean }
  ): Promise<Item>
  createMessage(
    ctx: Context,
    collectionId: string,
    content?: any,
    preview?: boolean
  ): Promise<Message>
  saveItem<T extends Item = Item>(ctx: Context, theItem: T): Promise<T>

  inviteUsersToCollection(
    ctx: Context,
    sharedCollection: Collection,
    targetUsers: User[]
  ): Promise<Collection>
  shareItemToCollection(
    ctx: Context,
    sharedItem: Item,
    collectionId: string
  ): Promise<Item>

  saveAccessChanges(
    ctx: Context,
    item: Item,
    accessChanges: AccessChanges
  ): Promise<Item>
  download(ctx: Context, item: FileItem): Promise<void>
}

export type DataEffects = BaseDataEffects & typeof helpers

export interface SelectedDocument {
  id: string
  // Where we extracted the item from.
  collectionId: string
  // If true, do not toggle on reselect
  force?: boolean
}

export interface DataConfig {
  state: {
    document: {
      // Warning: There is more 'document' state defined in 'document' block
      search: string
      // how to view the collection content 'Messages', 'Items', 'Users', etc
      view: string
      sort?: 'title' | 'date'
      current: Derive<DataConfig['state']['document'], Item | undefined>
      selected?: SelectedDocument
      selectedCollectionId?: string
    }
    data: {
      login: {
        username: string
        email: string
        admin: boolean
        protected: boolean
        wordList: string[]
        wordListVerify: string[]
        error: string | undefined
        valid: Derive<DataConfig['state']['data']['login'], boolean>
        nameValid: Derive<DataConfig['state']['data']['login'], boolean>
      }
      token?: string
      // Always present. Set to empty values if not logged in.
      auth: User
      // Maximum number of bytes allowed for upload. Defaults to 4Mb
      uploadLimit: number
    }
    fileCache: {
      [fileId: string]: File
    }
    db: {
      Collection: {
        [collId: string]: Collection
      }
      PairCollection: {
        [collId: string]: PairCollection
      }
      WorkCollection: {
        [collId: string]: WorkCollection
      }
      PrivateCollection: {
        [collId: string]: Collection
      }
      Item: {
        [itemId: string]: Item
      }
      Contact: {
        [contactId: string]: Contact
      }
      User: {
        [userId: string]: User
      }
      File: {
        [itemId: string]: FileItem
      }
    }
    msgDb: {
      [collId: string]: {
        [messageId: string]: Message
      }
    }
  }
  actions: {
    data: typeof actions
  }
  effects: {
    data: DataEffects
  }
}

type GraphQL = string

export interface TypeHandler {
  // Data to load on app boot.
  query: GraphQL
  // GraphQL mutation to create, update, delete. A delete operation
  // is simply setting deleted field to true.
  mutation: GraphQL
  // GraphQL subscription to get updates on changed items.
  subscription: GraphQL
  // Sequence run when an Item is changed (created/updated/deleted or loaded from cache).
  callback?<T extends Base>(app: IContext<Config>): ItemCallback<T>
}

export interface AuthHandler {
  // Mutation to create a new contact (admin only):
  // {id, username, email, contact: string, privateKeys: string, publicKeys: string, privateCollection: string, workCollection: string }
  // Receives {contact: Contact} (not really needed: subscription will notify shared items)
  createContact: GraphQL

  // Mutation to create session
  // Receives {sessionId: string}
  // sessionId is used to create the Vasudeva token,
  // which is used in headers for all other queries
  mutateSession: GraphQL

  // Query to get the session from sessionId
  // Receives the full session with keys, userId, etc.
  querySession: GraphQL

  // Query to get the current user from userId.
  // Receives the full User with username, email, etc.
  authenticatedUser: GraphQL

  // Mutation to delete session
  logout: GraphQL
}

export interface TypeHandlers {
  // Declare types used in the app.
  [type: string]: TypeHandler
}

export interface TransportSettings {
  types: TypeHandlers
  endpoint: {
    // Just some string printed to console on connect.
    name?: string
    graphql: string
    cdn: string
    subscriptions: string
  }
  authentication: AuthHandler
  // When true, data does not run onInitialize.
  skipInit: boolean
  uploadLimit?: number
}

export interface DataSettings {
  data?: Partial<TransportSettings>
}

export interface SessionVariables {
  userId: string
  id: string
  type: 'Session'
  onlineAt: string
  keys: string
  token: string
  info?: string
}
