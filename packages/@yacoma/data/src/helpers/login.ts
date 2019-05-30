import { User } from '@yacoma/security'
import { Context } from '../app'
import { Item } from '../dataTypes'

export async function loggedIn(ctx: Context, user: User) {
  const { state, effects } = ctx
  const { data, dialog } = effects
  // Set authenticated user
  state.data.auth = user
  state.db.User[user.id] = user

  // Remove login dialog
  dialog.hide(ctx)

  // Query all items
  await data.query<Item>(ctx, 'Item')

  // Subscribe to new items
  return data.subscribe(ctx, 'Item')
}
