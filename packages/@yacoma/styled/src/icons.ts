import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'

export const icons: { [key: string]: IconDefinition } = {
  CheckboxOn: faCheckSquare,
  CheckboxOff: faSquare,
}

library.add(...Object.keys(icons).map(k => icons[k]))
