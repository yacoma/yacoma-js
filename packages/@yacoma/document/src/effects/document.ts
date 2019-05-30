import { Item, SelectedDocument } from '@lucidogen/data'
import { newComposition } from '@lucidogen/editor'
import { isCollection } from '@lucidogen/security'
import { Context } from '../app'
import { NewDocumentArg } from '../args'
import { Document } from '../types'

export async function createDocument(
  ctx: Context,
  arg: NewDocumentArg
): Promise<Item> {
  const { data } = ctx.effects
  const { type, collectionId } = arg

  const item = await data.createItem(ctx, type)
  if (collectionId) {
    await data.shareItemToCollection(ctx, item, collectionId)
  }

  const doc = item as Document
  doc.composition = newComposition({ id: 'base', select: true, title: true })
  return doc
}

export function makeItemSelection(item: Item): SelectedDocument {
  if (isCollection(item.raw)) {
    return { id: item.id, collectionId: item.id }
  } else {
    return {
      id: item.id,
      collectionId: Object.keys(item.raw.collectionAccess)[0],
    }
  }
}
