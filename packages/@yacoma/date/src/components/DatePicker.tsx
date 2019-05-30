import { Icon } from '@lucidogen/styled'
import classnames from 'classnames'
import moment, { Moment } from 'moment'
import * as React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Comp, theme, useOvermind } from '../app'

const DAYS = [0, 1, 2, 3, 4, 5, 6]
const WEEKS = [0, 1, 2, 3, 4, 5]
const DATE_ONLY = 'YYYY-M-D'

export interface DatePickerProps {
  date: string | number | undefined
  view?: 'Time' | 'Date'
  onChange(date: number | undefined): void
}

const CalendarWrap = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  user-select: none;
`

const Calendar = styled.div`
  background: ${theme.datePickerBackground};
  border-radius: ${theme.datePickerBorderRadius};
  color: ${theme.datePickerColor};
  padding: ${theme.datePickerPadding};
  margin: 0.2rem;
  width: 15rem;
`

const Head = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  line-height: 1.5rem;
  min-height: 2.1rem;
`

const Month = styled.div`
  flex-grow: 1;
  text-align: center;
`

const Week = styled.div`
  display: flex;
  justify-content: space-around;
`

const CalTab = styled.div`
  border: 1px solid #666;
  cursor: pointer;
  flex-grow: 1;
  margin: 3px 0;
  padding: 3px;
  text-align: center;
  &.selected {
    box-shadow: ${theme.datePickerInsetShadow};
    background: ${theme.datePickerInsetBackground};
    padding: 5px 3px 1px;
  }
  &:first-child {
    border-right: 0;
    border-top-left-radius: ${theme.datePickerBorderRadius};
    border-bottom-left-radius: ${theme.datePickerBorderRadius};
  }
  &:last-child {
    border-top-right-radius: ${theme.datePickerBorderRadius};
    border-bottom-right-radius: ${theme.datePickerBorderRadius};
  }
`

const Day = styled.div`
  border-radius: ${theme.datePickerBorderRadius};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 0.8rem;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  padding: ${theme.datePickerPadding};
  text-align: center;
  &.Om {
    color: ${theme.datePickerOffColor};
  }
  &.selected {
    background: ${theme.datePickerSelectedBackground};
  }
  &.today {
    color: ${theme.datePickerHighColor};
  }
`

const TimeHead = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem;
`

const TimeTitle = styled.div``

const TimeBlock = styled.div`
  border-radius: ${theme.datePickerBorderRadius};
  background: ${theme.datePickerSelectedBackground};
  font-size: 2rem;
  padding: 0.4rem;
`

const DotBlock = styled.div`
  font-size: 2rem;
  padding: 0.4rem;
`

const LeftRow = styled.div`
  display: flex;
  margin: 0.5rem;
`

const Slider = styled.input`
  margin: 0 1.3rem;
  width: 100%;
`

export const DatePicker: Comp<DatePickerProps> = ({
  onChange,
  date: theDate,
  view: theView,
}) => {
  const app = useOvermind()
  const now = app.state.date.now
  const date = theDate !== undefined ? moment(theDate) : undefined
  const [m, setM] = useState(date)
  const [view, setView] = useState(theView || 'Date')
  const [nav, setNav] = useState(date || moment(now || Date.now()))

  // istanbul ignore next
  function changeDate(m: Moment | undefined) {
    onChange(m ? m.toDate().getTime() : undefined)
    if (m) {
      setM(m)
      setNav(m)
    } else {
      setM(m)
    }
  }

  const translate = app.state.locale.translate
  const weekDayStart = app.state.date.weekDayStart

  let content: JSX.Element
  if (view === 'Time') {
    content = (
      <div>
        <TimeHead>
          <TimeBlock>{nav.format('HH')}</TimeBlock>
          <DotBlock>:</DotBlock>
          <TimeBlock>{nav.format('mm')}</TimeBlock>
        </TimeHead>

        <LeftRow>
          <TimeTitle>{translate('Hours')}</TimeTitle>
        </LeftRow>
        <Head>
          <Slider
            type="range"
            value={nav.hours()}
            step={1}
            min={0}
            max={23}
            onChange={
              // istanbul ignore next
              e => {
                const target = e.target as HTMLInputElement
                changeDate(nav.clone().hours(parseInt(target.value)))
              }
            }
          />
        </Head>

        <LeftRow>
          <TimeTitle>{translate('Minutes')}</TimeTitle>
        </LeftRow>
        <Head>
          <Slider
            type="range"
            value={nav.minutes()}
            step={5}
            min={0}
            max={55}
            onChange={
              // istanbul ignore next
              e => {
                const target = e.target as HTMLInputElement
                changeDate(nav.clone().minutes(parseInt(target.value)))
              }
            }
          />
        </Head>
      </div>
    )
  } else {
    const currMonth = nav.month()
    const selectedDate = m ? m.format(DATE_ONLY) : ''
    const today = moment(app.state.date.now || Date.now()).format(DATE_ONLY)
    // 0-7 (0 = Sunday). Week day when the current month starts
    const currMonthWeekDay = nav
      .clone()
      .date(1)
      .day()
    // Distance from target start week day
    const missingWeekDays = (7 + currMonthWeekDay - weekDayStart) % 7
    // Number of weeks
    const firstDay = nav
      .clone()
      .date(1)
      .subtract(missingWeekDays, 'day')
    const weeks: Moment[] = WEEKS.map(idx => firstDay.clone().add(idx, 'week'))
    content = (
      <div>
        <Head>
          <Icon
            icon="PreviousMonth"
            onClick={
              // istanbul ignore next
              () => setNav(nav.clone().subtract(1, 'month'))
            }
          />
          <Month>{nav.format('MMMM YYYY')}</Month>
          <Icon
            icon="NextMonth"
            onClick={
              // istanbul ignore next
              () => setNav(nav.clone().add(1, 'month'))
            }
          />
        </Head>

        <Head>
          {DAYS.map(idx => (
            <Day key={idx}>
              {translate(`CalDay${(weekDayStart + idx) % 7}`)}
            </Day>
          ))}
        </Head>

        {weeks.map((weekDate, idx) => (
          <Week key={idx}>
            {DAYS.map(idx => {
              const date = weekDate.clone().add(idx, 'day')
              return (
                <Day
                  key={idx}
                  className={classnames({
                    Om: date.month() !== currMonth,
                    selected: date.format(DATE_ONLY) === selectedDate,
                    today: date.format(DATE_ONLY) === today,
                  })}
                  onClick={
                    // istanbul ignore next
                    () =>
                      changeDate(
                        date.format(DATE_ONLY) === selectedDate
                          ? undefined
                          : (m || nav).clone().set({
                              year: date.year(),
                              month: date.month(),
                              date: date.date(),
                            })
                      )
                  }
                >
                  {date.date()}
                </Day>
              )
            })}
          </Week>
        ))}
      </div>
    )
  }
  return (
    // Avoid text selection.
    <CalendarWrap>
      <Calendar>
        <Head>
          <CalTab
            className={classnames({ selected: view !== 'Time' })}
            onClick={
              // istanbul ignore next
              () => setView('Date')
            }
          >
            {translate('Date')}
          </CalTab>
          <CalTab
            className={classnames({ selected: view === 'Time' })}
            onClick={
              // istanbul ignore next
              () => {
                setView('Time')
              }
            }
          >
            {translate('Time')}
          </CalTab>
        </Head>
        {content}
      </Calendar>
    </CalendarWrap>
  )
}
