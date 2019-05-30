import { joinText } from './joinText'
import { ElementType, GroupElementType, StringElementType } from './types'

export function fuse(
  a: StringElementType,
  b: StringElementType,
  c?: ElementType
): GroupElementType {
  const elem = Object.assign(
    {},
    (c || a) as GroupElementType, // TS cannot figure out that 'i' will be replaced
    { i: joinText(a.i, b.i) }
  )
  delete elem.g
  return elem
}
