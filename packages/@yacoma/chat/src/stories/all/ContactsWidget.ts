import {
  ContactsWidget as component,
  ContactsWidgetProps as Props,
} from '../../'
import { config, Stories } from '../helper'

export const contactsWidget: Stories<Props> = {
  name: 'ContactsWidget',
  config,
  component,
  stories: [
    {
      name: 'simple',
      props: {},
      state: {
        menu: {
          show: {
            Contacts: true,
          },
        },
      },
    },
  ],
}
