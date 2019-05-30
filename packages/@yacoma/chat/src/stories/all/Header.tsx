import {
  Header as component,
  HeaderProps as Props,
} from '../../components/Contacts/Header'
import { config, Stories } from '../helper'

export const recentChats: Stories<Props> = {
  name: 'RecentChats',
  config,
  component,
  stories: [
    {
      name: 'simple',
    },
  ],
}
