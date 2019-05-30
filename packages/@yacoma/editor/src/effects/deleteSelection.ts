import { Context } from '../app'
import { doBackspace } from '../lib/doBackspace'
import { CompositionSelectionArgs, ProcessOpsArgs } from '../lib/utils/types'

export function deleteSelection(
  ctx: Context,
  value: CompositionSelectionArgs
): ProcessOpsArgs {
  const editor = ctx.state.editor.options()
  const { holder, selection } = value
  return { holder, ops: doBackspace(editor, holder.composition!, selection) }
}
