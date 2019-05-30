import { doBackspace } from './doBackspace'
import { caretSelection } from './utils/caretSelection'
import { mockComposition } from './utils/testUtils'

const composition = mockComposition()

describe('doBackspace', () => {
  it('removes last character', () => {
    const selection = caretSelection(['para2', 'span22'], 2)
    expect(doBackspace(() => undefined, composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para2', 'span22'],
        value: { p: 1, t: 'B', i: 'mssage' },
      },
      {
        op: 'select',
        value: caretSelection(['para2', 'span22'], 1),
      },
    ])
  })

  it('merges with previous paragraph at start of line', () => {
    const selection = caretSelection(['para2', 'span21'], 0)
    expect(doBackspace(() => undefined, composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para1', 'span15'],
        value: { p: 4, t: 'T', i: '.This is the first ' },
      },
      {
        op: 'select',
        value: caretSelection(['para1', 'span15'], 1),
      },
      {
        op: 'update',
        path: ['para1', 'span22'],
        value: { p: 5, t: 'B', i: 'message' },
      },
      {
        op: 'update',
        path: ['para1', 'span23'],
        value: { p: 6, t: 'T', i: '. Hello blah bomgolo frabilou elma tec.' },
      },
      { op: 'delete', path: ['para2'] },
    ])
  })

  it('merges and fuse with previous complex paragraph at start of line', () => {
    const selection = caretSelection(['para3'], 0)
    expect(doBackspace(() => undefined, composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para2', 'span23'],
        value: {
          p: 2,
          t: 'T',
          i:
            '. Hello blah bomgolo frabilou elma tec.This is the third paragraph. My tailor types fast.',
        },
      },
      {
        op: 'select',
        value: caretSelection(['para2', 'span23'], 39),
      },
      { op: 'delete', path: ['para3'] },
    ])
  })

  it('merges with previous complex paragraph at start of line', () => {
    const selection = caretSelection(['para3'], 0)
    const composition = mockComposition()
    const comp = composition as any
    comp.g['para2'].g['span23'].t = 'B+I'
    expect(doBackspace(() => undefined, composition, selection)).toEqual([
      {
        op: 'update',
        path: ['para2', 'para3'],
        value: {
          p: 3,
          t: 'T',
          i: 'This is the third paragraph. My tailor types fast.',
        },
      },
      {
        op: 'select',
        value: caretSelection(['para2', 'para3'], 0),
      },
      { op: 'delete', path: ['para3'] },
    ])
  })
})
