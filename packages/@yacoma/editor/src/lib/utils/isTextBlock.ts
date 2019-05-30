import { ElementType, isStringElement, StringElementType } from './types'

interface TextBlocks {
  [key: string]: true | undefined
}

const TEXT_BLOCKS: TextBlocks = {
  P: true,
  H: true,
  T: true,
}

/** Return true if the current element is a text block.
 */
export function isTextBlock(elem: ElementType): elem is StringElementType {
  const { t, o } = elem
  return ((TEXT_BLOCKS[t] || !o) && isStringElement(elem)) || false
}
