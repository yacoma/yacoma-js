import { doEnter } from '../lib/doEnter'
import { CompositionSelectionArgs, ProcessOpsArgs } from '../lib/utils/types'

export function handleEnter(args: CompositionSelectionArgs): ProcessOpsArgs {
  const { holder, selection } = args
  return { holder, ops: doEnter(holder.composition!, selection) }
}
