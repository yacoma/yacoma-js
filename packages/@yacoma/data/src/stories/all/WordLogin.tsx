import { WordLoginCard as component, WordLoginCardProps as Props } from '../..'
import { config, Stories } from '../helper'

export const wordLogin: Stories<Props> = {
  name: 'WordLogin',
  config,
  stories: [
    {
      name: 'simple',
      component,
    },
  ],
}
