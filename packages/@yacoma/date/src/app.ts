import { IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { LocaleConfig } from '@yacoma/locale'
import { themeProxy } from '@yacoma/theme'
import { DateConfig } from './'
import { dateTheme } from './theme'

export { styled, Comp }

export type Config = DateConfig & LocaleConfig

export const theme = themeProxy(dateTheme)

export const useOvermind = createHook<Config>()

export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>
