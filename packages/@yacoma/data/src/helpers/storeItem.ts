import {
  helper,
  ItemTypesWithoutMessage,
  PairCollection as RawPairCollection,
  pairCollectionId,
} from '@yacoma/security'
import { MiniContext } from '../app'
import {
  isContact,
  isFile,
  isMessage,
  isWorkCollection,
  Item,
} from '../dataTypes'

export function storeItem({ state }: MiniContext, item: Item): Item {
  const auth = state.data.auth
  const uid = auth.id
  if (isMessage(item)) {
    const collId = Object.keys(item.raw.collectionAccess)[0]
    if (!state.msgDb[collId]) {
      state.msgDb[collId] = {}
    }
    state.msgDb[collId][item.id] = item
    // Return proxified Message
    return state.msgDb[collId][item.id]
  } else if (isContact(item)) {
    const user = item.user
    state.db.User[user.id] = user
    const pairId = pairCollectionId(uid, user.id)
    if (!auth.protected) {
      if (!state.db.PairCollection[pairId] && item.user.id !== uid) {
        // We do not display our own PairCollection because we have the private chat
        // to talk to ourselves. We don't need a PairCollection, it would become
        // insane.

        // Protected users do not see PairCollections.

        // For sharing and communication, we only display collections so we need to make
        // as if the PairCollection was already there.
        state.db.PairCollection[pairId] = {
          $unsaved: true,
          $user: item.user,
          id: pairId,
          type: 'PairCollection',
          title: item.title,
          savedAt: item.savedAt,
          raw: {
            type: 'PairCollection',
            userAccess: {
              [uid]: {
                access: 'r+-',
              },
              [user.id]: {
                access: 'r+-',
              },
            },
          } as RawPairCollection,
        }
      }

      if (
        helper.canEditAccess(auth, item.raw) ||
        helper.canEditContent(auth, item.raw)
      ) {
        // If the Contact can be edited, it should be shown as
        // a normal item.
        state.db.Item[item.id] = item

        // Return proxified contact
        return state.db.Item[item.id]
      } else {
        state.db.Contact[item.id] = item

        // Return proxified contact
        return state.db.Contact[item.id]
      }
    }
    // Return contact (not proxified since it is not saved in db and should
    // not be used anyway).
    return item
  } else if (isWorkCollection(item)) {
    const user = item.user
    state.db.User[user.id] = user

    if (!auth.protected) {
      // Protected users cannot view other users for messaging or sharing.
      state.db.WorkCollection[item.id] = item
      // We return the proxified item
      return state.db.WorkCollection[item.id]
    }
    // Return work collection (not proxified since it is not saved in db and should
    // not be used anyway).
    return item
  } else if (isFile(item)) {
    state.db.Item[item.id] = item
    return state.db.Item[item.id]
  } else {
    const type = item.type as ItemTypesWithoutMessage
    // Collections, normal items
    state.db[type][item.id] = item
    // We return the proxified item
    return state.db[type][item.id]
  }
}
