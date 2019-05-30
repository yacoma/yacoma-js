// TODO: migrate all 'effects/index' to files like this
/*
import { DataEffects } from '../types'
import { DataFxContext } from './types'
import * as security from '@yacoma/security'
import { Message } from '../dataTypes'

export async function createMessage(context: DataFxContext) {
  const fn: DataEffects['createMessage'] = async (
    ctx,
    collectionId,
    content
  ) => {
    if (!context.user) {
      throw new Error(`Cannot create message: no current user.`)
    }

    const raw = await security.createItem(
      context.user,
      { type: 'Message' },
      content,
      collectionId
    )
    const item = await context.saveItem(
      ctx,
      Object.assign({}, content, { raw }),
      true
    )
    return item as Message
  }
  return fn
}
*/
