import { action } from 'overmind'
import { Operator } from '../app'

export const openParagraph: Operator<{
  id: string
  paragraphId: string
}> = action((_ctx, value) => {
  console.log('document.openParagraph', value)
})
