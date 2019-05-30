import { Stories } from '@yacoma/story'
import { Date as component, DateProps } from '../../'
import { styled } from '../../app'
import { config } from '../helper'

const MyDate = styled(component)`
  color: orange;
  background: yellow;
`

export const date: Stories<DateProps> = {
  name: 'Date',
  config: config,
  stories: [
    {
      name: 'simple',
      component,
      props: { date: Date.now() },
    },

    {
      name: 'string date',
      component,
      props: { date: '2018-11-13T15:22:55.281Z' },
    },

    {
      name: 'styled',
      component: MyDate,
      props: { date: Date.now() },
    },
  ],
}
