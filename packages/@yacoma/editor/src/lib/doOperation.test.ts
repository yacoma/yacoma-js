import { doOperation } from './doOperation'
import { caretSelection } from './utils/caretSelection'
import { rangeSelection } from './utils/rangeSelection'
import { mockComposition, mockRef } from './utils/testUtils'

const composition = mockComposition()

describe('doOperation.B', () => {
  it('renders bold selection', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    expect(
      doOperation(() => undefined, composition, selection, 'B', {})
    ).toEqual([
      {
        op: 'update',
        path: ['para3'],
        value: { t: 'P', p: 2, g: {} },
      },
      {
        op: 'update',
        path: ['para3', 'refe1'],
        value: { t: 'T', p: 0, i: 'This is the ' },
      },
      {
        op: 'update',
        path: ['para3', 'refe2'],
        value: { t: 'B', p: 1, i: 'third' },
      },
      {
        op: 'update',
        path: ['para3', 'refe3'],
        value: { t: 'T', p: 2, i: ' paragraph. My tailor types fast.' },
      },
      {
        op: 'select',
        value: rangeSelection(['para3', 'refe2'], 0, ['para3', 'refe2'], 5),
      },
    ])
  })

  it('removes bold selection', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    expect(
      doOperation(() => undefined, composition, selection, 'B', {
        o: { href: 'bar' },
      })
    ).toEqual([
      {
        op: 'delete',
        path: ['para2', 'span22'],
      },
      {
        op: 'delete',
        path: ['para2', 'span23'],
      },
      {
        op: 'update',
        path: ['para2'],
        value: {
          t: 'P',
          p: 1,
          i: 'This is the first message. Hello blah bomgolo frabilou elma tec.',
        },
      },
      {
        op: 'select',
        value: rangeSelection(['para2'], 18, ['para2'], 25),
      },
    ])
  })

  it('renders larger bold selection', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span21'],
      5,
      ['para2', 'span23'],
      7
    )

    expect(
      doOperation(() => undefined, composition, selection, 'B', {})
    ).toEqual([
      {
        op: 'delete',
        path: ['para2', 'span22'],
      },
      {
        op: 'delete',
        path: ['para2', 'refe2'],
      },
      {
        op: 'update',
        path: ['para2', 'span21'],
        value: { t: 'T', p: 0, i: 'This ' },
      },
      {
        op: 'update',
        path: ['para2', 'refe1'],
        value: { t: 'B', p: 0.5, i: 'is the first message. Hello' },
      },
      {
        op: 'update',
        path: ['para2', 'span23'],
        value: { t: 'T', p: 3, i: ' blah bomgolo frabilou elma tec.' },
      },
      {
        op: 'select',
        value: rangeSelection(['para2', 'refe1'], 0, ['para2', 'refe1'], 27),
      },
    ])
  })

  it('renders bold selection after other markup', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span23'],
      13,
      ['para2', 'span23'],
      20
    )

    expect(
      doOperation(() => undefined, composition, selection, 'B', {})
    ).toEqual([
      {
        op: 'update',
        path: ['para2', 'span23'],
        value: { t: 'T', p: 2, i: '. Hello blah ' },
      },
      {
        op: 'update',
        path: ['para2', 'refe1'],
        value: { t: 'B', p: 3, i: 'bomgolo' },
      },
      {
        op: 'update',
        path: ['para2', 'refe2'],
        value: { t: 'T', p: 4, i: ' frabilou elma tec.' },
      },
      {
        op: 'select',
        value: rangeSelection(['para2', 'refe1'], 0, ['para2', 'refe1'], 7),
      },
    ])
  })
})

describe('doOperation.P', () => {
  it('creates custom paragraph', () => {
    mockRef()
    const selection = caretSelection(['para3'], 0)
    const opts = { c: 'Foo', data: { this: 'that' } }
    expect(
      doOperation(() => undefined, composition, selection, 'P', opts)
    ).toEqual([
      {
        op: 'update',
        path: ['para3'],
        value: { t: 'P', p: 2, c: 'Foo' },
      },
      // Ensure last paragraph is a text one.
      {
        op: 'update',
        path: ['refe1'],
        value: { t: 'P', p: 3, i: '' },
      },
      {
        op: 'select',
        value: selection,
      },
      { op: 'toolbox' },
      {
        op: 'data',
        path: ['para3'],
        data: { this: 'that' },
      },
    ])
  })
})
