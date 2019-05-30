import { ElementType, isDocumentTitle } from '../../lib'

export function getElementClassName(elem: ElementType) {
  switch (elem.t) {
    case 'B':
      return 'strong'
    case 'I':
      return 'em'
    case 'B+I':
      return 'strong em'
    case 'P':
      if (isDocumentTitle(elem)) {
        return elem.i === '' ? 'Title Empty' : 'Title'
      } else {
        return elem.i === '' ? 'Empty' : undefined
      }
    default:
      return
  }
}
