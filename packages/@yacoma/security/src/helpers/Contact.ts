import { makeId } from '@yacoma/crypt'
import { collectionAccessValue, UserWithKeys } from '../types'
import { createCollection } from './Collection'
import { createItem } from './Item'
import { contactId, workCollectionId } from './Item/makeId'
import { shareCollectionToUser } from './sharing'
import { createUser } from './User'

export async function createContact(
  // currentUser can be undefined to create the first admin user (only possible
  // from the command line).
  currentUser: UserWithKeys | undefined,
  wordList: string[],
  // User information
  info: {
    username: string
    admin?: boolean
    protected?: boolean
    email?: string
  },
  addressBookCollId?: string
) {
  const protectedUser = info.protected
  const allInfo = Object.assign(
    {},
    info,
    currentUser
      ? { domain: currentUser.domain || '' } // '' would break on validation: should not happen
      : {
          domain: makeId().slice(0, 8),
        }
  )
  const { user, privateCollection } = await createUser(wordList, allInfo)
  const id = contactId(user.id)

  if (!currentUser) {
    currentUser = user
  }

  if (protectedUser) {
    // ==== PROTECTED USER ====
    const workCollection = await createCollection(
      user,
      {
        type: 'WorkCollection',
        id: workCollectionId(user.id),
      },
      {
        title: info.username,
        user: Object.assign({}, user.user, info),
      }
    )

    // Share workCollection with admin so that admin can add other people to it.
    await shareCollectionToUser(
      user,
      workCollection,
      currentUser.user,
      collectionAccessValue.admin
    )

    // No contact for protected users
    return { user, privateCollection, workCollection }
  } else {
    const contact = await createItem(
      currentUser,
      {
        id,
        type: 'Contact',
      },
      {
        title: info.username,
        user: user.user,
      },
      addressBookCollId
    )
    // No work collection for non-protected users.
    return { user, privateCollection, contact }
  }
}
