import { createEncryptionKey, decrypt, makeId, sign } from '@lucidogen/crypt'
import * as security from '@lucidogen/security'
import {
  decryptBinaryFile,
  isPairCollectionId,
  privateCollectionId,
  stringifyFields,
} from '@lucidogen/security'
import axios, { AxiosRequestConfig } from 'axios'
import { GraphQLClient } from 'graphql-request'
import { Variables } from 'graphql-request/dist/src/types'
import { Observer, SubscriptionClient } from 'subscriptions-transport-ws'
import { Context } from '../app'
import {
  Collection,
  Contact,
  contentFromItem,
  FileItem,
  isFile,
  Item,
  itemFromContent,
  Message,
  PairCollection,
  isMessage,
} from '../dataTypes'
import * as helpers from '../helpers'
import { getItem, isShared, storeItem } from '../helpers'
import {
  BaseDataEffects,
  DataEffects,
  SessionVariables,
  TransportSettings,
} from '../types'

interface RequestOpts {
  token?: string
  progress?: (percent: number) => void
}

class DataError extends Error {
  constructor(m: string) {
    super(m) // 'Error' breaks prototype chain

    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

function deepMergeChanges({
  looser,
  original,
  winner,
}: {
  looser: { [key: string]: any }
  original: { [key: string]: any }
  winner: { [key: string]: any }
}) {
  console.log({ looser, original, winner })
  const allKeys = Object.keys(Object.assign({}, looser, winner))
  allKeys.forEach(key => {
    const originalValue = original[key]
    const looserValue = looser[key]
    const winnerValue = winner[key]
    // Any change in remote is executed to local

    if (Array.isArray(winnerValue)) {
      // Array is just writen to local if changed (no merge)
      if (JSON.stringify(winnerValue) !== JSON.stringify(originalValue)) {
        // incoming changed compared to original
        looser[key] = winnerValue
      }
    } else if (typeof winnerValue === 'object') {
      if (Array.isArray(looserValue)) {
        // Bug in type. Just overwrite with incoming
        looser[key] = winnerValue
      } else if (typeof looserValue === 'object') {
        // Deep merge
        deepMergeChanges({
          winner: winnerValue,
          original: originalValue || {},
          looser: looserValue,
        })
      } else {
        looser[key] = winnerValue
      }
    } else if (JSON.stringify(winnerValue) !== JSON.stringify(originalValue)) {
      // Changed in remote
      if (winnerValue === undefined) {
        delete looser[key]
      } else {
        looser[key] = winnerValue
      }
    }
  })
}

export function makeEffects({
  types,
  endpoint,
  authentication,
  skipInit,
}: TransportSettings): DataEffects {
  const context: {
    user?: security.UserWithKeys
    client: GraphQLClient
    subscriptionClient: SubscriptionClient
    expire?: number
    sessionId?: string
    token: string
    endpoint: TransportSettings['endpoint']
  } = {
    client: new GraphQLClient(endpoint.graphql, {
      headers: {},
    }),
    subscriptionClient: new SubscriptionClient(endpoint.subscriptions, {
      reconnect: true,
    }),
    endpoint,
    token: '',
  }
  if (endpoint.name) {
    console.info(`Connected to ${endpoint.name}.`)
  }

  // Simple graphql client. All format validations are done server-side because
  // why bother checking twice ?
  async function request<T>(
    query: string,
    variables?: Variables,
    opts: RequestOpts = {}
  ): Promise<T> {
    const headers = {
      Now: Date.now().toString(),
      Authorization: opts.token !== undefined ? opts.token : getAuthToken(),
    }

    let data: AxiosRequestConfig['data'] = { query, variables }

    const file = variables && (variables.file as File)
    if (file) {
      // Super simplified graphql-multipart-request spec implementation. With
      // some little time, we could make this right with a tiny lib
      // @lucidogen/axios-graphql
      data = new FormData()
      data.append(
        'operations',
        JSON.stringify({
          query,
          variables: Object.assign({}, variables, { file: null }),
        })
      )
      data.append('map', JSON.stringify({ [0]: ['variables.file'] }))
      data.append('0', new Blob([file]))
    }

    const progress = opts.progress
    const onUploadProgress: AxiosRequestConfig['onUploadProgress'] = progress
      ? p => progress(p.loaded / p.total)
      : undefined

    return axios
      .request({
        url: endpoint.graphql,
        method: 'post',
        headers,
        data,
        onUploadProgress,
      })
      .then(({ data: result, headers }) => {
        const { data, errors } = result
        if (!data) {
          throw new DataError(
            errors.map((e: { message: string }) => e.message).join('\n')
          )
        }

        const skew = headers['timeskew']
        if (!skew) {
          throw new DataError(
            'Invalid server response: missing exposed Timeskew header.'
          )
        }
        security.setRemoteNow(Date.now() + parseInt(skew))

        return data[Object.keys(data)[0]]
      })
      .catch(err => {
        if (err instanceof DataError) {
          throw err
        } else if (!err.response) {
          throw new Error(`Offline`)
        } else {
          throw err
        }
      })
  }

  function getAuthToken(
    user: { id: string; sign: string | Uint8Array } | undefined = context.user,
    sessionId: string | undefined = context.sessionId
    // expire: number | undefined = context.expire
  ): string {
    // Is it costly to generate tokens ? Why don't we create a new one on
    // each request ? An upload can take long and if it happens at the end
    // of a token validity, it might start with a valid token but end with
    // an invalid one...
    // if (!expire || expire <= security.remoteNow()) {
    if (sessionId && user) {
      const { token, expire } = security.createToken(user, sessionId)
      context.token = token
      context.expire = expire
    }
    // }
    return context.token
  }

  async function createSession(
    user: security.UserWithKeys,
    info?: { [key: string]: string }
  ): Promise<string | null> {
    const onlineAt = await sign(user.signKey, security.remoteNow())
    const sessionKey = await createEncryptionKey()
    const keys = await security.encryptWordKeys(
      user.signKey,
      sessionKey.encryptionKey,
      user
    )

    const sessionId = makeId()

    const { token } = security.createToken(user, sessionId)
    const variables: SessionVariables = {
      userId: user.id,
      id: sessionId,
      type: 'Session',
      onlineAt,
      keys,
      // Token is needed here because the request needs to parse it
      token,
    }

    if (info) {
      variables.info = await sign(user.signKey, info)
    }
    const response = await request<{ id: string }>(
      authentication.mutateSession,
      variables,
      // Authorization is not set for this query.
      { token: '' }
    ).catch(() => {
      // Invalid token
      return null
    })
    if (response) {
      localStorage.setItem('sessionKey', sessionKey.encrypt)
      localStorage.setItem('sessionId', sessionId)
      return response.id
    } else {
      return null
    }
  }

  function loggedOut() {
    delete context.sessionId
    delete context.token
    localStorage.removeItem('sessionKey')
    localStorage.removeItem('sessionId')
    return null
  }

  async function saveItem<T extends Item = Item>(
    ctx: Context,
    item: T,
    isNew: boolean = false,
    opts: RequestOpts = {}
  ): Promise<T> {
    if (item.$saving) {
      // Simply ignore save operation if another one is in progress
      return item
    }

    item.$saving = true
    delete item.$changed
    const newItem = (await dbToItem(
      ctx,
      await mutate(await itemToDb(item, isNew), opts)
    )) as T
    delete item.$saving

    return newItem
  }

  // Send an anlready signed and prepared item to remote.
  async function mutate<T extends security.Base = security.Base>(
    entity: T,
    opts: RequestOpts = {}
  ): Promise<T> {
    if (!entity.id || !entity.type) {
      throw new Error(`Missing 'id' or 'type' in entity. Cannot mutate.`)
    }
    const type = security.isItem(entity) ? 'Item' : entity.type
    const handler = types[type]
    if (!handler) {
      throw new Error(`No handlers for '${type}' type.`)
    }
    if (!handler.mutation) {
      throw new Error(`Missing 'mutation' handler for '${type}' type.`)
    }
    return request<T>(handler.mutation, entity, opts)
  }

  // Parse an item coming from the database.
  async function dbToItem<T extends Item = Item>(
    ctx: Context | undefined,
    dbItem: security.ItemStringified
  ): Promise<T> {
    const rawItem = security.parseFields(dbItem)
    const { editor } = rawItem
    const itemKey = await security.getItemKey(context.user!, rawItem)
    const { payload: remoteContent } = await decrypt<Item>(
      editor,
      itemKey.encryptionKey,
      rawItem.content
    )
    const item = itemFromContent(rawItem, remoteContent)

    if (ctx) {
      // Context only exists in regular calls from actions (not in callback).
      const current = isMessage(item)
        ? getItem(ctx, item.id, Object.keys(item.raw.collectionAccess)[0])
        : getItem(ctx, item.id)
      if (current && current.$changed) {
        // Compare what changed and deep merge
        const { payload: originalContent } = await decrypt<Item>(
          current.raw.editor,
          itemKey.encryptionKey,
          current.raw.content
        )
        current.raw = item.raw
        deepMergeChanges({
          winner: current,
          original: originalContent,
          looser: remoteContent,
        })
        return current as T
      } else {
        storeItem(ctx, item)
      }
    }
    return item as T
  }

  async function itemToDb<T extends Item = Item>(
    item: T,
    isNew: boolean
  ): Promise<security.ItemStringified> {
    const content = contentFromItem(item)
    let file: Uint8Array | undefined
    if (isFile(item)) {
      file = item.file
    }

    // We put the file back in dbItem so that it is uploaded on save.
    const dbItem = Object.assign({}, item.raw, file ? { file } : {})
    if (!isNew) {
      dbItem.revision += 1
    }

    await security.setContent(context.user!, dbItem, content)
    return security.stringifyFields(
      // File field not in signature.
      await security.dateAndSign(context.user!, dbItem)
    )
  }

  async function logout() {
    const sessionId = localStorage.getItem('sessionId')
    await request(authentication.logout, { id: sessionId }).catch(err => {
      console.error(err)
    })
    return loggedOut()
  }

  async function loginWithSession(): Promise<security.User | 'offline' | null> {
    try {
      const sessionId = localStorage.getItem('sessionId')
      const sessionKey = localStorage.getItem('sessionKey')
      if (!sessionId || !sessionKey) {
        return null
      }
      const response = await request(
        authentication.querySession,
        {
          id: sessionId,
        },
        // No Authorization
        { token: '' }
      ).catch(err => {
        if (err.message === 'Offline') {
          return err.message
        }
        return null
      })
      if (response === 'Offline') {
        // server is offline
        console.warn(`Remote server '${context.endpoint.graphql}' is offline.`)
        return 'offline'
      } else if (response) {
        const userKeys = await security.decryptWordKeys(
          sessionKey,
          response.userId,
          response.keys
        )
        const token = getAuthToken(
          { id: response.userId, sign: userKeys.signKey },
          sessionId
          // undefined
        )
        // Query user
        const userResponse = await request<security.User>(
          authentication.authenticatedUser,
          {},
          { token }
        )
        if (userResponse) {
          context.user = await security.decryptUser(
            userKeys.encryptionKey,
            userResponse
          )

          context.sessionId = sessionId
          getAuthToken()
        }
        return userResponse
      } else {
        // invalid
        return logout()
      }
    } catch (err) {
      console.warn(`Could not autologin with session (${err}).`)
      return logout()
    }
  }

  const subscriptionCallback: { [type: string]: (entity: any) => void } = {}

  const base: BaseDataEffects = {
    skipInit,

    registerCallbacks(ctx: Context) {
      // Setup callbacks for subscriptions.
      subscriptionCallback['default'] = ctx.actions.data.itemChanged
      Object.keys(types).forEach(type => {
        const handler = types[type]
        if (handler.callback) {
          subscriptionCallback[type] = handler.callback(ctx)
        }
      })
    },

    async query<T extends security.Base>(
      ctx: Context,
      type: string,
      variables: any = {}
    ): Promise<T[]> {
      await getAuthToken()
      const handler = types[type]
      if (!handler) {
        throw new Error(`No handlers for '${type}' type.`)
      }
      if (!handler.query) {
        throw new Error(`Missing 'query' handler for '${type}' type.`)
      }

      const list = await request<security.Base[]>(handler.query, variables)
      if (list[0] && security.isItem(list[0])) {
        const collections = list.filter(item => security.isCollection(item))
        const items = list.filter(item => !security.isCollection(item))
        const parsedCollections = await Promise.all(
          collections.map(entity =>
            dbToItem(ctx, entity as security.ItemStringified)
          )
        )
        const parsedItems = await Promise.all(
          items.map(entity => dbToItem(ctx, entity as security.ItemStringified))
        )
        // How should we type things if to make this work ?
        // @ts-ignore
        return [...parsedCollections, ...parsedItems]
      } else {
        return list as T[]
      }
    },

    async subscribe(ctx, type, variables) {
      if (!context.user) {
        throw new Error(`Cannot subscribe to '${type}': no current user.`)
      }
      const handler = types[type]
      if (!handler) {
        throw new Error(`No handlers for '${type}' type.`)
      }
      if (!handler.subscription) {
        throw new Error(`Missing 'subscription' handler for '${type}' type.`)
      }
      // How do we set auth header for subscription ?
      // await setAuthHeader()
      const callback =
        subscriptionCallback[type] || subscriptionCallback['default']

      const subscriptionClient = context.subscriptionClient
      const subscription = subscriptionClient.request({
        query: handler.subscription,
        variables,
      })

      const observer: Observer<{
        data?: { [key: string]: security.ItemStringified }
        error?: any
      }> = {
        async next(result) {
          if (result.data) {
            if (typeof result.data !== 'object') {
              throw new Error(
                `Invalid data received in ${type} subscription. Data should be { [mutationName]: { id, type, ... } }. Received: ${JSON.stringify(
                  result.data
                )}`
              )
            }
            const entity = result.data[Object.keys(result.data)[0]]
            if (typeof entity !== 'object') {
              throw new Error(
                `Invalid data received in ${name}. Data should be { [mutationName]: { id, type, ... } }. Received: ${JSON.stringify(
                  result.data
                )}`
              )
            }
            try {
              // We are not in an action here so we cannot storeItem.
              callback(await dbToItem(undefined, entity))
            } catch (err) {
              console.error('COULD NOT RECEIVE ITEM', err)
              console.info(entity)
            }
          } else {
            throw new Error(
              `Invalid data received in ${name}. Data should be { [mutationName]: { id, type, ... } }. Received: ${JSON.stringify(
                result.data
              )}${result.error ? ` (${result.error})` : ''}`
            )
          }
        },
        error(error) {
          // Remote server offline.
          console.warn(error)
        },
        complete() {
          // What is this for ?
        },
      }
      subscription.subscribe(observer)
    },

    async register(ctx) {
      console.warn(
        'Registration disabled for now. Use `createContact` from an admin account.'
      )
      return null
    },

    async createContact(ctx) {
      const form = ctx.state.data.login

      if (!context.user) {
        throw new Error(`Cannot create contact: no current user.`)
      }
      if (!context.user.admin) {
        throw new Error(`Cannot create contact: no current user.`)
      }
      const records = await security.createContact(
        context.user,
        form.wordList,
        {
          username: form.username,
          admin: form.admin,
          protected: form.protected,
          email: form.email,
        }
      )

      const user = records.user.user

      const privateCollectionRaw = records.privateCollection
      const privateCollection = JSON.stringify(
        security.stringifyFields(
          // Signed by new user itself
          await security.dateAndSign(records.user, privateCollectionRaw)
        )
      )

      let workCollection: string | undefined
      if (records.workCollection) {
        const workCollectionRaw = records.workCollection
        workCollection = JSON.stringify(
          security.stringifyFields(
            // Signed by new user itself
            await security.dateAndSign(records.user, workCollectionRaw)
          )
        )
      }

      let contact: string | undefined
      if (records.contact) {
        const contactRaw = records.contact
        contact = JSON.stringify(
          security.stringifyFields(
            // Signed by creator (admin user)
            await security.dateAndSign(context.user, contactRaw)
          )
        )
      }

      const result = await request<security.ItemStringified>(
        authentication.createContact,
        Object.assign({}, user, {
          privateCollection,
          workCollection,
          contact,
        })
      )
      const item = await dbToItem(ctx, result)
      return item as Contact
    },

    async login({ state }) {
      const user = await security.userFromWordList(state.data.login.wordList)
      if (await createSession(user)) {
        return loginWithSession()
      } else {
        return loggedOut()
      }
    },

    autoLogin: loginWithSession,
    logout,

    async createPairCollection(ctx, otherUser): Promise<Collection> {
      if (!context.user) {
        throw new Error(`Cannot create pair collection: no current user.`)
      }
      const raw = await security.createPairCollection(context.user, otherUser)
      const collection = await saveItem(ctx, { title: '', raw } as Item, true)
      return collection as Collection
    },

    ///  UI STUFF
    async saveItem<T extends Item = Item>(ctx: Context, item: T): Promise<T> {
      if (!context.user) {
        throw new Error(`Cannot save item: no current user.`)
      }
      return saveItem(ctx, item)
    },

    async createItem(
      ctx,
      type,
      content,
      opts: { file?: File; collectionId?: string; open?: boolean } = {}
    ): Promise<Item> {
      if (!context.user) {
        throw new Error(`Cannot create item: no current user.`)
      }

      if (type === 'File' && !opts.file) {
        throw new Error(`Cannot create file item: missing file.`)
      }

      if (opts.file) {
        // Make a dummy FileItem for fast UI response.
        const dummy = await security.createFileDummy(
          context.user,
          opts.file,
          content,
          opts.collectionId
        )

        const fileItem = itemFromContent(
          dummy.raw,
          dummy.content as FileItem
        ) as FileItem
        fileItem.$uploaded = 0

        // Preload so that we can display the file right away
        const rawFileId = dummy.raw.fileId
        ctx.state.fileCache[dummy.raw.fileId] = opts.file

        // In case the user edited title or other information, we continue working with
        // the proxied item.
        const item = storeItem(ctx, fileItem) as FileItem

        if (opts.open) {
          const collectionId =
            opts.collectionId || privateCollectionId(context.user.id)
          ctx.actions.data.select({
            id: item.raw.id,
            collectionId,
          })

          ctx.actions.data.selectCollection(collectionId)
          ctx.state.document.sort = 'date'
          ctx.state.styled.show['navigation']['explorer'] = true
        }

        const { raw, payload } = await security.createFileFromDummy(
          context.user,
          item.raw as security.FileItem,
          opts.file,
          contentFromItem(item)
        )
        // Update changes from final item. 'raw' is edited in place.
        Object.assign(item, {
          file: payload,
          fileId: raw.fileId,
          fileSize: raw.fileSize,
        })

        // Update cache
        delete ctx.state.fileCache[rawFileId]
        ctx.state.fileCache[item.fileId] = opts.file

        return saveItem(ctx, item, true, {
          progress: pcent => {
            if (pcent === 1) {
              delete item.$uploaded
            } else {
              item.$uploaded = pcent
            }
          },
        })
      } else {
        const raw =
          type === 'Collection'
            ? await security.createCollection(context.user, {}, content)
            : await security.createItem(
                context.user,
                {},
                content,
                opts.collectionId
              )
        const item = await saveItem(
          ctx,
          Object.assign(
            { title: '' },
            content || {},
            { type: raw.type, id: raw.id, savedAt: raw.savedAt },
            { raw }
          ),
          true
        )
        if (opts.open) {
          ctx.actions.data.select({
            id: item.id,
            collectionId:
              opts.collectionId || privateCollectionId(context.user.id),
          })
        }
        return item
      }
    },

    async createMessage(ctx, collectionId, content, preview): Promise<Message> {
      if (!context.user) {
        throw new Error(`Cannot create message: no current user.`)
      }

      const raw = await security.createItem(
        context.user,
        { type: 'Message' },
        content,
        collectionId
      )
      if (preview) {
        raw.revision = 0
        const newItem = await dbToItem(ctx, stringifyFields(raw))
        storeItem(ctx, newItem)
        newItem.$changed = true
        return newItem as Message
      } else {
        const newItem = await saveItem(
          ctx,
          Object.assign({}, content, { raw }),
          true
        )
        return newItem as Message
      }
    },

    async inviteUsersToCollection(ctx, sharedCollection, targetUsers) {
      if (!context.user) {
        throw new Error(`Cannot invite user to collection: no current user.`)
      }

      const userAccess = sharedCollection.raw.userAccess
      const newUsers = targetUsers.filter(
        user =>
          !userAccess[user.id] || !userAccess[user.id].access.includes('r')
      )
      if (!newUsers.length) {
        // No need to share again
        return sharedCollection
      }

      await Promise.all(
        newUsers.map(user =>
          security.shareCollectionToUser(
            context.user!,
            sharedCollection.raw,
            user
          )
        )
      )
      // Now we should save the collection to remote. It will be pushed to new users.
      const item = await saveItem(ctx, sharedCollection)
      return item as Collection
    },

    async shareItemToCollection(ctx, sharedItem, collectionId) {
      if (!context.user) {
        throw new Error(`Cannot share item to collection: no current user.`)
      }

      if (sharedItem.raw.collectionAccess[collectionId]) {
        // No need to share again
        return sharedItem
      }

      await security.shareItemToCollection(
        context.user!,
        sharedItem.raw,
        collectionId
      )

      // Now we should save the item with to remote. It will be pushed to all the
      // collections including the new one.
      return saveItem(ctx, sharedItem)
    },

    async saveAccessChanges(ctx, item, changes): Promise<Item> {
      if (!context.user) {
        throw new Error(`Cannot save access changes: no current user.`)
      }
      if (security.isCollectionId(item.id)) {
        throw new Error(`FIXME: share collection.`)
      }

      const { collectionAccess, userAccess, message } = changes
      const collKeys = Object.keys(collectionAccess)
      const addedCollections = collKeys.filter(
        k => collectionAccess[k] === true
      )
      if (addedCollections.length && !message) {
        throw new Error(`Cannot add to new collections without a message.`)
      }
      const changedItem = Object.assign({}, item)
      changedItem.raw = Object.assign({}, item.raw)

      // Update collection access
      await Promise.all(
        collKeys.map(async collectionId => {
          if (collectionAccess[collectionId] === true) {
            if (isPairCollectionId(collectionId)) {
              const coll = getItem(ctx, collectionId) as PairCollection
              if (coll.$unsaved) {
                // The 'Contact' was used as temporary PairCollection
                await this.createPairCollection(ctx, coll.$user!)
                // OK, now we have a proper PairCollection.
              }
            }
            security.shareItemToCollection(
              context.user!,
              changedItem.raw,
              collectionId
            )
          } else {
            return security.unshareItemToCollection(
              context.user!,
              changedItem.raw,
              collectionId
            )
          }
        })
      )
      // Create messages for added collections
      // Update userAccess
      const userKeys = Object.keys(userAccess)
      const newUserAccess = Object.assign({}, changedItem.raw.userAccess)
      userKeys.filter(k => userAccess[k] === false).forEach(userId => {
        // remove user
        delete newUserAccess[userId]
      })
      userKeys.filter(k => userAccess[k] !== false).forEach(userId => {
        const type = userAccess[userId]
        let access = ''
        // remove user
        if (type === 'a') {
          access = security.isCollectionId(changedItem.id)
            ? security.collectionAccessValue.admin
            : security.itemAccessValue.admin
        } else if (type === 'e') {
          access = security.isCollectionId(changedItem.id)
            ? security.collectionAccessValue.editor
            : security.itemAccessValue.editor
        } else {
          throw new Error(`Unknown user access '${type}'.`)
        }
        // FIXME: collection sharing !!
        if (!newUserAccess[userId]) {
          newUserAccess[userId] = {
            access,
          }
        } else {
          newUserAccess[userId].access = access
        }
      })
      security.setUserAccess(context.user, changedItem.raw, newUserAccess)

      const content = {
        title: message!,
        attachments: {
          [changedItem.id]: { id: changedItem.id },
        },
      }
      await Promise.all(
        addedCollections.map(async collectionId => {
          const collection = helpers.getItem(ctx, collectionId)
          if (collection && isShared(ctx, collection)) {
            // Create message
            const raw = await security.createItem(
              context.user!,
              { type: 'Message' },
              content,
              collectionId
            )

            const message: Message = {
              id: raw.id,
              type: 'Message',
              savedAt: raw.savedAt,
              raw,
              title: content.title,
              attachments: content.attachments,
            }

            return saveItem(ctx, message, true)
          } else {
            return {}
          }
        })
      )
      return saveItem(ctx, changedItem)
    },

    async download(ctx, item) {
      const url = `${endpoint.cdn}/${item.fileBy}/${item.fileId}`
      // We have the database for stats and such so we do
      // not add the 'domain' because it can change in the
      // user.
      axios
        .request({
          url,
          method: 'get',
          responseType: 'blob',
        })
        .then(async ({ data }: { data: Blob }) => {
          const buffer = await security.getFileBuffer(data)
          const itemKey = await security.getItemKey(context.user!, item.raw)
          const file = await decryptBinaryFile(
            item.fileBy,
            itemKey.encryptionKey,
            buffer,
            item
          )
          ctx.state.fileCache[item.fileId] = file
        })
        .catch(err => {
          throw new Error(err)
        })
    },
  }
  return Object.assign({}, helpers, base)
}
