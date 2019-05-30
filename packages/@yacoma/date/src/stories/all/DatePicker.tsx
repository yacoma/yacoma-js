import { Stories } from '@yacoma/story'
import { DatePicker as component, DatePickerProps } from '../../'
import { config } from '../helper'

export const picker: Stories<DatePickerProps> = {
  name: 'DatePicker',
  config,
  stories: [
    {
      name: 'simple',
      component,
      props: {
        date: Date.now(),
        onChange(date: any) {
          console.log(date)
        },
      },
    },

    {
      name: 'view time',
      component,
      props: {
        date: Date.now(),
        view: 'Time',
        onChange(date: any) {
          console.log(date)
        },
      },
    },

    {
      name: 'no date',
      component,
      props: {
        // no date
        date: undefined as any,
        onChange(date: any) {
          console.log(date)
        },
      },
    },

    {
      name: 'string date',
      component,
      props: {
        date: '2018-11-13T15:22:55.281Z',
        onChange(date: any) {
          console.log(date)
        },
      },
    },

    {
      name: 'Sunday start',
      component,
      state: {
        date: {
          weekDayStart: 0,
        },
      },
      props: {
        date: Date.now(),
        onChange(date: any) {
          console.log(date)
        },
      },
    },
  ],
}
