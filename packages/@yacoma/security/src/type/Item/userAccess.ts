import * as helpers from '../../helpers'
import { Context, Item, UserAccess, isCollection } from '../../types'

export const ACCESS_KEYS = ['a', 'e', 'r', '+', '-']

const ITEM_VALID_ACCESS = ['a', 'ae', 'aer', 'ar', 'e', 'er', 'r']
const COLLECTION_VALID_ACCESS = [
  ...ITEM_VALID_ACCESS,
  ...ITEM_VALID_ACCESS.map(a => `${a}+`),
  ...ITEM_VALID_ACCESS.map(a => `${a}-`),
  ...ITEM_VALID_ACCESS.map(a => `${a}+-`),
]

function checkAccess(type: string, access: string): boolean {
  if (type === 'PairCollection') {
    return access === 'er+-'
  } else if (isCollection({ type })) {
    return COLLECTION_VALID_ACCESS.includes(access)
  } else {
    return ITEM_VALID_ACCESS.includes(access)
  }
}

export function validateUserAccessEntries(
  type: string,
  userAccess: UserAccess
): string | void {
  for (const k of Object.keys(userAccess)) {
    const def = userAccess[k]
    const access = def.access
    if (!checkAccess(type, access)) {
      return `userAccess: invalid access ${JSON.stringify(
        access
      )} for user "${k}" in item type "${type}"`
    }
  }
}

export function userAccess({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  if (!oldRecord) {
    // Create
    if (
      !helpers.canEditAccess(currentUser, newRecord) &&
      newRecord.type !== 'PairCollection'
    ) {
      return 'userAccess: does not allow admin access to current user (new item)'
    }
    return validateUserAccessEntries(newRecord.type, newRecord.userAccess)
  } else if (
    JSON.stringify(oldRecord.userAccess) !==
    JSON.stringify(newRecord.userAccess)
  ) {
    // Update
    if (!helpers.canEditAccess(currentUser, oldRecord)) {
      return 'userAccess: should only be changed by an admin'
    }
    if (!helpers.canEditAccess(currentUser, newRecord)) {
      return 'userAccess: should not remove your admin access'
    }
    return validateUserAccessEntries(newRecord.type, newRecord.userAccess)
  }
}
