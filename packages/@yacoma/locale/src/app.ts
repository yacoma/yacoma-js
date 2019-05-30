import { IDerive, IOperator } from 'overmind'
import { LocaleConfig } from './types'

export type Operator<Input = any, Output = Input> = IOperator<
  LocaleConfig,
  Input,
  Output
>
export type Derive<Value> = IDerive<
  LocaleConfig,
  LocaleConfig['state']['locale'],
  Value
>
