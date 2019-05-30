import { describe, expect, it } from 'test'

import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { changesResults, mockComposition, mockRef } from './testUtils'

const composition = mockComposition()

describe('applyOp', () => {
  it('extracts simple selection in plain paragraph', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    const changes = extractSelection(composition, selection)
    expect(changesResults(applyOp(composition, changes, 'B'))).toEqual({
      selected: ['para3.refe2-B'],
      updated: ['para3-P', 'para3.refe1-T', 'para3.refe2-B', 'para3.refe3-T'],
      deleted: [],
    })
  })
})
