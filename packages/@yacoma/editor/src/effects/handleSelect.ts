import { doSelect } from '../lib/doSelect'
import { CompositionSelectionArgs, ProcessOpsArgs } from '../lib/utils/types'

export function handleSelect(args: CompositionSelectionArgs): ProcessOpsArgs {
  const { holder, selection } = args
  return { holder, ops: doSelect(holder.composition!, selection) }
}
