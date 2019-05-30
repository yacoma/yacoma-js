import { DialogConfig } from '@lucidogen/dialog'
import { HooksConfig } from '@lucidogen/hooks'
import { LocaleConfig } from '@lucidogen/locale'
import { StyledConfig } from '@lucidogen/styled'
import { ThemeConfig } from '@lucidogen/theme'
import { IContext, IDerive, IOperator, IState } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
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
export type MiniContext = {
  state: IContext<DataConfig & LocaleConfig>['state']
}
