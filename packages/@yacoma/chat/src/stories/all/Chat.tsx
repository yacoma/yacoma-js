import {
  Chat as component,
  ChatProps as Props,
} from '../../components/Contacts/Chat'
import { config, Stories } from '../helper'

export const chat: Stories<Props> = {
  name: 'Chat',
  config,
  component,
  stories: [
    {
      name: 'simple',
    },
  ],
}
