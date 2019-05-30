import { IContext, IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled, { css } from 'styled-components'
import { DialogConfig } from './types'

export { css, styled, Comp }

export type Config = DialogConfig

export type Context = IContext<Config>

export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export const useOvermind = createHook<Config>()
