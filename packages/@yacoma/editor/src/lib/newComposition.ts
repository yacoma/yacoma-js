import { caretSelection } from './utils/caretSelection'
import { makeRef } from './utils/makeRef'
import { CompositionType, ElementType } from './utils/types'

export interface NewCompositionOptions {
  id?: string
  title?: string | boolean
  paragraphs?: string[]
  select?: boolean
}

export function newComposition(
  opts: NewCompositionOptions = {}
): CompositionType {
  const id = opts.id || makeRef()
  const { title, paragraphs } = opts
  const hasTitle = typeof title === 'string' || title === true
  const titleValue = typeof title === 'string' ? title : ''
  const elem: ElementType = {
    t: 'P',
    i: titleValue,
    p: 0,
    s: caretSelection([id], 0),
  }
  if (hasTitle) {
    elem.o = { h: 1, title: true }
  }
  const comp = {
    g: {
      [id]: elem,
    },
    spath: id,
  }

  if (paragraphs) {
    paragraphs.forEach((para, idx) => {
      const id = makeRef()
      const elem: ElementType = {
        t: 'P',
        i: para,
        p: idx + 1,
      }
      comp.g[id] = elem
    })
  }

  if (opts.select) {
    comp.spath = id
    comp.g[id].s = caretSelection([id], 0)
  }
  return comp
}
