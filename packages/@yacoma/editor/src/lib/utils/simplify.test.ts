import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { simplify } from './simplify'
import { changesResults, mockComposition } from './testUtils'

const composition = mockComposition()

describe('simplify', () => {
  it('merges same elements', () => {
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    const rawChanges = applyOp(
      composition,
      extractSelection(composition, selection),
      'B'
    )

    const simplified = simplify(() => undefined, composition, rawChanges)
    expect(changesResults(simplified).updated).toEqual(['para2-P'])

    expect(simplified.elements['para2'].elem.i).toEqual(
      // All fused in parent
      'This is the first message. Hello blah bomgolo frabilou elma tec.'
    )
  })
})
