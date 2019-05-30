import { caretSelection } from './caretSelection'
import { deleteSelection } from './deleteSelection'
import { rangeSelection } from './rangeSelection'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('deleteSelection', () => {
  it('removes selected text in simple selection', () => {
    const selection = rangeSelection(
      ['para2', 'span22'],
      1,
      ['para2', 'span22'],
      4
    )
    expect(deleteSelection(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para2', 'span22'],
        value: { p: 1, t: 'B', i: 'mage' },
      },
      {
        op: 'select',
        value: caretSelection(['para2', 'span22'], 1),
      },
    ])
  })

  it('merge elements in wide selection without fuse', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para3'],
      20
    )
    expect(deleteSelection(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para1', 'span12', 'span122'],
        value: { p: 1, t: 'B+I', i: 'li' },
      },
      {
        op: 'select',
        value: caretSelection(['para1', 'span12', 'span122'], 2),
      },
      { op: 'delete', path: ['para1', 'span13'] },
      { op: 'delete', path: ['para1', 'span14'] },
      { op: 'delete', path: ['para1', 'span15'] },
      { op: 'delete', path: ['para2'] },
      {
        op: 'update',
        path: ['para1', 'para3'],
        value: { p: 2, t: 'T', i: 'ragraph. My tailor types fast.' },
      },
      { op: 'delete', path: ['para3'] },
    ])
  })

  it('merge elements in wide selection with fuse', () => {
    const selection = rangeSelection(['para1', 'span13'], 8, ['para3'], 8)
    expect(deleteSelection(composition, selection)).toEqual([
      {
        op: 'select',
        value: caretSelection(['para1', 'span13'], 8),
      },
      { op: 'delete', path: ['para1', 'span14'] },
      { op: 'delete', path: ['para1', 'span15'] },
      { op: 'delete', path: ['para2'] },
      {
        op: 'update',
        path: ['para1', 'span13'],
        value: {
          p: 2,
          t: 'T',
          i: 'to view the third paragraph. My tailor types fast.',
        },
      },
      { op: 'delete', path: ['para3'] },
    ])
  })

  it('merge elements in local selection accross markup with fuse', () => {
    const selection = rangeSelection(
      ['para2', 'span21'],
      12,
      ['para2', 'span23'],
      13
    )
    expect(deleteSelection(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para2'],
        value: { p: 1, t: 'P', i: 'This is the bomgolo frabilou elma tec.' },
      },
      {
        op: 'select',
        value: caretSelection(['para2'], 12),
      },
    ])
  })

  it('wide selection two levels deep without fuse', () => {
    const selection = rangeSelection(['para2', 'span22'], 3, ['para3'], 32)

    const ops = deleteSelection(composition, selection)
    expect(
      ops // deleteSelection ( composition, selection )
    ).toEqual([
      {
        op: 'update',
        path: ['para2', 'span22'],
        value: { p: 1, t: 'B', i: 'mes' },
      },
      // Could be select in para2.para3 (check what is expected)
      {
        op: 'select',
        value: caretSelection(['para2', 'span22'], 3),
      },
      { op: 'delete', path: ['para2', 'span23'] },
      {
        op: 'update',
        path: ['para2', 'para3'],
        value: { p: 2, t: 'T', i: 'tailor types fast.' },
      },
      { op: 'delete', path: ['para3'] },
    ])
  })

  it('wide selection three levels deep without fuse', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para2', 'span23'],
      35
    )
    expect(deleteSelection(composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para1', 'span12', 'span122'],
        value: { p: 1, t: 'B+I', i: 'li' },
      },
      {
        op: 'select',
        value: caretSelection(['para1', 'span12', 'span122'], 2),
      },
      { op: 'delete', path: ['para1', 'span13'] },
      { op: 'delete', path: ['para1', 'span14'] },
      { op: 'delete', path: ['para1', 'span15'] },
      { op: 'delete', path: ['para2', 'span21'] },
      { op: 'delete', path: ['para2', 'span22'] },
      {
        op: 'update',
        path: ['para1', 'span23'],
        value: { p: 2, t: 'T', i: 'tec.' },
      },
      { op: 'delete', path: ['para2'] },
    ])
  })
})
