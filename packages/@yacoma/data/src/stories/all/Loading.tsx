import { LoadingCard as component, LoadingProps as Props } from '../..'
import { config, Stories } from '../helper'

export const loading: Stories<Props> = {
  name: 'Loading',
  config,
  stories: [
    {
      name: 'simple',
      component,
    },
  ],
}
