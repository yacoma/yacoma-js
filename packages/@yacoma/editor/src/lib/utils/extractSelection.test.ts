import { describe, expect, it } from 'test'

import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { changesResults, mockComposition, mockRef } from './testUtils'

const composition = mockComposition()

describe('extractSelection', () => {
  it('extracts simple selection in plain paragraph', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para3.refe2-T'],
      updated: ['para3-P', 'para3.refe1-T', 'para3.refe2-T', 'para3.refe3-T'],
      deleted: [],
    })
  })

  it('extracts selection accross markup', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span21'],
      5,
      ['para2', 'span23'],
      7
    )
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2.refe1-T', 'para2.span22-B', 'para2.refe2-T'],
      updated: [
        'para2.span21-T',
        'para2.refe1-T',
        'para2.span22-B',
        'para2.refe2-T',
        'para2.span23-T',
      ],
      deleted: [],
    })
  })

  it('extracts single element fully selected', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2.span22-B'],
      updated: ['para2.span22-B'],
      deleted: [],
    })
  })

  it('extracts accross paragraphs', () => {
    mockRef()
    const selection = rangeSelection(['para2', 'span21'], 8, ['para3'], 7)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: [
        'para2.refe1-T',
        'para2.span22-B',
        'para2.span23-T',
        'para3.refe2-T',
      ],
      updated: [
        'para2.span21-T',
        'para2.refe1-T',
        'para2.span22-B',
        'para2.span23-T',
        'para3-P',
        'para3.refe2-T',
        'para3.refe3-T',
      ],
      deleted: [],
    })
  })
})
