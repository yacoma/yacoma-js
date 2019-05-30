import * as simple from 'simple-mock'

import * as makeref from './makeRef'
import { ChangesType, CompositionType } from './types'

const composition1: CompositionType = {
  g:
    // Block = PARAGRAPH / MEDIA LEVEL
    {
      para1:
        // position
        {
          p: 0,
          // type <p>
          t: 'P',
          // children or string
          g: {
            span11: {
              p: 0,
              // <span>
              t: 'T',
              i: 'You can click ',
            },
            // Link
            span12: {
              p: 1,
              // <a>
              t: 'A',
              o: {
                href: 'http://example.com',
              },
              g: {
                span121: {
                  p: 0,
                  t: 'T',
                  i: 'this ',
                },
                span122: {
                  p: 1,
                  // <span class='s e'>
                  t: 'B+I',
                  i: 'link ',
                },
              },
            },
            span13: {
              p: 2,
              // <span>
              t: 'T',
              i: 'to view the next ',
            },
            span14: {
              p: 3,
              t: 'I',
              i: 'page',
            },
            span15: {
              p: 4,
              t: 'T',
              i: '.',
            },
          },
        },
      para2: {
        p: 1,
        t: 'P',
        g:
          // Markup = bold, italic, etc
          {
            span21: {
              p: 0,
              t: 'T',
              i: 'This is the first ',
            },
            span22: {
              p: 1,
              t: 'B',
              i: 'message',
            },
            span23: {
              p: 2,
              t: 'T',
              i: '. Hello blah bomgolo frabilou elma tec.',
            },
          },
      },
      para3: {
        p: 2,
        t: 'P',
        i: 'This is the third paragraph. My tailor types fast.',
      },
    },
}

export function mockComposition(): CompositionType {
  return JSON.parse(MOCK1)
}

export function mockRef(): void {
  let counter = 0
  simple.mock(makeref, 'makeRef').callFn(() => `refe${++counter}`)
}

interface ChangeResults {
  selected: string[]
  updated: string[]
  deleted: string[]
}

const MOCK1 = JSON.stringify(composition1)

export function changesResults(changes: ChangesType): ChangeResults {
  const { elements, selected, deleted, updated } = changes
  return {
    selected: selected.map(ref => {
      const refElem = elements[ref]
      return refElem.path.join('.') + '-' + refElem.elem.t
    }),
    updated: updated.map(ref => {
      const refElem = elements[ref]
      return refElem.path.join('.') + '-' + refElem.elem.t
    }),
    deleted: (deleted || []).map(path => path.join('.')),
  }
}
