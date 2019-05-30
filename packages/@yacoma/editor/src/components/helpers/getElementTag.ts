import { ElementType } from '../../lib'

export function getElementTag(
  { t, o }: ElementType,
  isParagraph: boolean = false
): 'p' | 'a' | 'span' | 'h1' | 'h2' | 'h3' {
  switch (t) {
    case 'P':
      if (o && o.h) {
        return `h${o.h}` as 'h1' | 'h2' | 'h3'
      } else {
        return 'p'
      }
    case 'A':
      return 'a'
    default:
      return isParagraph ? 'p' : 'span'
  }
}
