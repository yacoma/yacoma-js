import {
  RegisterNameCard as component,
  RegisterNameCardProps as Props,
} from '../..'
import { config, Stories } from '../helper'

export const registerName: Stories<Props> = {
  name: 'RegisterName',
  config,
  stories: [
    {
      name: 'simple',
      component,
    },
  ],
}
