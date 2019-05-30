import {
  ExplorerWidget as component,
  ExplorerWidgetProps as Props,
} from '../../'
import { config, Stories } from '../helper'

export const contactsWidget: Stories<Props> = {
  name: 'ExplorerWidget',
  config,
  component,
  stories: [
    {
      name: 'simple',
      props: {},
      state: {
        menu: {
          show: {
            Explorer: true,
          },
        },
      },
    },
  ],
}
