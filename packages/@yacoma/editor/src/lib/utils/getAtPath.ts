import { CompositionType, ElementType, isGroupElement } from './types'

/* Returns the element at the given path
*/
export function getAtPath(
  composition: CompositionType,
  path: string[],
  allowMissing: boolean = false
): ElementType {
  const elem = path.reduce(
    (current, key) => {
      if (isGroupElement(current)) {
        return current.g[key]
      } else {
        throw new Error(`Invalid path in composition: '${path.join('.')}'.`)
      }
    },
    composition as ElementType
  )
  if (!elem && !allowMissing) {
    console.log(composition)
    throw new Error(`No element at path '${path.join('.')}'.`)
  }
  return elem
}
