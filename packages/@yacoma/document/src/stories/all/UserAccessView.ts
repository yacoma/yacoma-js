import { UserAccessView as component, EditorsProps as Props } from '../../'
import { config, Stories } from '../helper'

export const editors: Stories<Props> = {
  name: 'Editors',
  config,
  component,
  state: {
    document: {
      selected: {
        id: 'i.blah',
        collectionId: 'c.sharedCollId',
      },
    },
  },
  stories: [
    {
      name: 'simple',
      props: {},
    },
  ],
}
