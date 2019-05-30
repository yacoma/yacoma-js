import {
  People as component,
  PeopleProps as Props,
} from '../../components/People'
import { config, Stories } from '../helper'

export const people: Stories<Props> = {
  name: 'People',
  config,
  component,
  stories: [
    {
      name: 'simple',
      props: {},
    },
  ],
}
