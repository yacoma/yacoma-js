import { describe, expect, it } from 'test'

import { doEnter } from './doEnter'
import { caretSelection } from './utils/caretSelection'
import { mockComposition, mockRef } from './utils/testUtils'

const composition = mockComposition()

describe('doEnter', () => {
  it('splits to make new paragraph', () => {
    mockRef()
    const selection = caretSelection(['para1', 'span12', 'span122'], 2)
    expect(doEnter(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para1', 'span12', 'span122'],
        value: { p: 1, t: 'B+I', i: 'li' },
      },
      { op: 'delete', path: ['para1', 'span13'] },
      { op: 'delete', path: ['para1', 'span14'] },
      { op: 'delete', path: ['para1', 'span15'] },
      {
        op: 'update',
        path: ['refe1'],
        value: {
          p: 0.5,
          t: 'P',
          g: {
            refe2: { p: 0, t: 'T', i: 'nk to view the next ' },
            span14: { p: 1, t: 'I', i: 'page' },
            span15: { p: 2, t: 'T', i: '.' },
          },
        },
      },
      {
        op: 'select',
        value: caretSelection(['refe1'], 0),
      },
    ])
  })

  it('creates new paragraph when selection at end', () => {
    mockRef()
    const selection = caretSelection(['para2', 'span23'], 39)
    expect(doEnter(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['refe1'],
        value: { p: 1.5, t: 'P', i: '' },
      },
      {
        op: 'select',
        value: caretSelection(['refe1'], 0),
      },
    ])
  })

  it('splits flat paragraph', () => {
    mockRef()
    const selection = caretSelection(['para3'], 11)
    expect(doEnter(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para3'],
        value: { p: 2, t: 'P', i: 'This is the' },
      },
      {
        op: 'update',
        path: ['refe1'],
        value: { p: 3, t: 'P', i: 'third paragraph. My tailor types fast.' },
      },
      {
        op: 'select',
        value: caretSelection(['refe1'], 0),
      },
    ])
  })
})
