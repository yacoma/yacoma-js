import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faParagraph } from '@fortawesome/free-solid-svg-icons/faParagraph'

export const icons: { [key: string]: IconDefinition } = {
  P: faParagraph,
}

library.add(...Object.keys(icons).map(k => icons[k]))
