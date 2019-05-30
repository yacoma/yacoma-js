import { Context, User } from '../../types'

export function userCreation({
  currentUser,
  oldRecord,
  newRecord,
}: Context<User>): string | void {
  if (!currentUser.admin) {
    return `User: only admin users can create other users.`
  }
  if (oldRecord) {
    // If we remove this make sure to disable 'admin' status change for self.
    return `User: cannot be modified.`
  }
}
