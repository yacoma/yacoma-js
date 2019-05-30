import { IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { DragdropConfig } from '../../types'
export { Comp, styled } from '../../app'

export interface TestConfig {
  state: {
    groups: {
      [key: string]: {
        [key: string]: string
      }
    }
  }
  actions: {
    group: {
      moveToGroup: Operator<{
        name: string
        group: string
        target: string
      }>
    }
    test: {
      showPayload: Operator<any>
    }
  }
}

type Config = TestConfig & DragdropConfig
export type Operator<Input, Output = Input> = IOperator<Config, Input, Output>

export const useOvermind = createHook<Config>()
