import { Context } from '../app'
import { FileItem } from '../dataTypes'

export function fileUrl(ctx: Context, item: FileItem): string | undefined {
  const file = ctx.state.fileCache[item.fileId]
  if (file) {
    return window.URL.createObjectURL(file)
  } else {
    ctx.actions.data.download(item)
  }
  return undefined
}

export function disposeUrl(url: string) {
  window.URL.revokeObjectURL(url)
}
