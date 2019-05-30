import { caretSelection } from '../lib'
import { CompositionType, SelectOperationType } from '../lib/utils/types'
import { processSelect } from './processOps'

export function selectParagraph(args: {
  paraId: string
  composition: CompositionType
}) {
  const { paraId, composition } = args
  const { spath } = composition
  if (spath && spath[0] === paraId) {
    // done
  } else {
    const op: SelectOperationType = {
      op: 'select',
      value: caretSelection([paraId], 0),
    }
    processSelect(composition, op)
    delete composition.toolbox
  }
}
