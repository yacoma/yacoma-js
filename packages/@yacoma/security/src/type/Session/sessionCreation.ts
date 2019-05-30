/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context, Item } from '../../types'

export function sessionCreation({
  currentUser,
  oldRecord,
  newRecord,
}: Context<Item>): string | void {
  // FIXME: Session validations...
}
