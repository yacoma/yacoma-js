import { CompositionType, isGroupElement } from '../lib'
import { getAtPath } from '../lib/utils/getAtPath'
import {
  CompositionWrapper,
  GroupElementType,
  isCustomElement,
  ProcessOpsArgs,
  SelectOperationType,
} from '../lib/utils/types'

function getParent(
  composition: CompositionType,
  path: string[]
): GroupElementType {
  const elem = getAtPath(composition, path.slice(0, -1))
  if (isGroupElement(elem)) {
    return elem
  } else {
    throw new Error(`Cannot update element at path '${path}' (not a group).`)
  }
}

export function processSelect(
  composition: CompositionType,
  op: SelectOperationType
) {
  const path = op.value.anchorPath.join('.')
  const oldPath = composition.spath
  if (oldPath !== path) {
    if (oldPath) {
      const oldElem = getAtPath(composition, oldPath.split('.'), true)
      if (oldElem) {
        delete oldElem.s
      }
    }
    composition.spath = path
  }
  const elem = getAtPath(composition, op.value.anchorPath)
  elem.s = op.value
}

/** This is just while code is unstable, to hack around bugs.
 * FIXME: REMOVE WHEN MORE STABLE
 */
function sanitize(comp: CompositionType) {
  let p = 1
  const list = Object.keys(comp.g)
    .map(key => ({ id: key, elem: comp.g[key] }))
    .sort((a, b) => a.elem.p - b.elem.p)
    .filter(({ id, elem }) => {
      if (isGroupElement(elem)) {
        if (Object.keys(elem.g).length === 0) {
          console.warn('Editor BUG: Empty group.')
          delete comp.g[id]
          return false
        }
      }
      return true
    })
  list.forEach(({ id, elem }, idx) => {
    // Check 'p' bugs.
    if (elem.p === p) {
      console.warn('Editor BUG: ordering error.')
      const next = list[idx + 1]
      p = next ? (p + next.elem.p) / 2 : p + 1
      comp.g[id].p = p
    } else {
      p = elem.p
    }
  })
}

export function processOps(args: ProcessOpsArgs) {
  const { ops, holder } = args
  if (!ops) {
    return
  }
  const { composition } = holder as CompositionWrapper
  ops.forEach(op => {
    switch (op.op) {
      case 'update':
        {
          const elem = getParent(composition, op.path)
          const last = op.path.slice(-1)[0]
          elem.g[last] = op.value
        }
        break
      case 'updateOpts':
        {
          const opts = op.opts
          const elem = getAtPath(composition, op.path)
          if (opts.o) {
            elem.o = opts.o
          } else {
            delete elem.o
          }
          if (opts.c) {
            elem.c = opts.c
          } else {
            delete elem.c
          }
        }
        break
      case 'delete':
        {
          const elem = getParent(composition, op.path)
          const id = op.path.slice(-1)[0]
          const oldElem = elem.g[id]
          delete elem.g[id]
          if (isCustomElement(oldElem) && composition.data) {
            delete composition.data[id]
          }
        }
        break
      case 'data':
        if (!composition.data) {
          composition.data = {}
        }
        composition.data[op.path[0]] = op.data
        break
      case 'select':
        processSelect(composition, op)
        break
      case 'toolbox':
        if (op.value) {
          composition.toolbox = op.value
        } else {
          delete composition.toolbox
        }
        break
    }
  })
  sanitize(composition)
}
