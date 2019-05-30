import { action } from 'overmind'
import { Operator } from '../app'
import { FileItem } from '../dataTypes'

export const upload: Operator<{
  files: File[]
  open?: boolean
  collectionId?: string
}> = action((ctx, opts) => {
  const { data } = ctx.effects
  opts.files.forEach((file, idx) =>
    data.createItem(
      ctx,
      'File',
      {},
      {
        open: idx === 0 ? opts.open : false,
        collectionId: opts.collectionId,
        file,
      }
    )
  )
})

export const download: Operator<FileItem> = action(async (ctx, item) => {
  const { data } = ctx.effects
  data.download(ctx, item)
})
