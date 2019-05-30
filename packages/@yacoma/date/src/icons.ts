import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faBackward } from '@fortawesome/free-solid-svg-icons/faBackward'
import { faForward } from '@fortawesome/free-solid-svg-icons/faForward'

export const icons: { [key: string]: IconDefinition } = {
  NextMonth: faForward,
  PreviousMonth: faBackward,
}

library.add(...Object.keys(icons).map(k => icons[k]))
