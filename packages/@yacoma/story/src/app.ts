import { IOperator } from 'overmind'
import { StoryConfig } from './'
import styled from 'styled-components'
import { FunctionComponent as Comp } from 'react'

export { Comp, styled }

export type Operator<Input, Output = Input> = IOperator<
  StoryConfig,
  Input,
  Output
>
import { createHook } from 'overmind-react'
export const useOvermind = createHook<StoryConfig>()
