import { Context } from '../app'
import { doOperation } from '../lib/doOperation'
import {
  ApplyOpArgs,
  InitFunction,
  InitParagraph,
  ProcessOpsArgs,
} from '../lib/utils/types'

function isInitFunction(init: InitParagraph | undefined): init is InitFunction {
  return typeof init === 'function'
}

export function handleOp(ctx: Context, props: ApplyOpArgs): ProcessOpsArgs {
  const editor = ctx.state.editor.options()
  const { holder, selection, op, opts } = props
  if (opts.c) {
    const para = editor.getParagraph(opts.c)
    if (!para) {
      throw new Error(`Invalid custom paragraph '${opts.c}'.`)
    }
    const init = para.init
    if (isInitFunction(init)) {
      opts.data = init(ctx, props)
    } else if (init) {
      opts.data = JSON.parse(JSON.stringify(init))
    }
  }
  return {
    holder,
    ops: doOperation(editor, holder.composition!, selection, op, opts),
  }
}
