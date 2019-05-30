import { IContext, IDerive, IOperator, IState } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { DialogConfig } from '@yacoma/dialog'
import { HooksConfig } from '@yacoma/hooks'
import { LocaleConfig } from '@yacoma/locale'
import { StyledConfig } from '@yacoma/styled'
import { ThemeConfig } from '@yacoma/theme'
import { DataConfig } from './types'

export { styled, Comp }

export type Config = DataConfig &
  DialogConfig &
  HooksConfig &
  LocaleConfig &
  ThemeConfig &
  StyledConfig

export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export type Derive<Parent extends IState, Value = any> = IDerive<
  Config,
  Parent,
  Value
>

export const useOvermind = createHook<Config>()

export type Context = IContext<Config>
export interface MiniContext {
  state: IContext<DataConfig & LocaleConfig>['state']
}
