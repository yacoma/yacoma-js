import { Context, User } from '../../types'

export function domain({
  oldRecord,
  newRecord,
  currentUser,
}: Context<User>): string | void {
  if (!currentUser.domain) {
    return `domain: cannot validate (domain not set in current user)`
  }
  if (!oldRecord) {
    // New
    if (newRecord.domain !== currentUser.domain) {
      return `domain: must be inherited from creator`
    }
  } else if (newRecord.domain !== oldRecord.domain) {
    return `domain: cannot be changed`
  }
}
