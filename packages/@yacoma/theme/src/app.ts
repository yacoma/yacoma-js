import { IDerive } from 'overmind'
import { createHook } from 'overmind-react'
import { ThemeConfig } from './types'
import { FunctionComponent as Comp } from 'react'
export { Comp }

// All derived are attached to state.theme = parent.
export type Derive<Value> = IDerive<
  ThemeConfig,
  ThemeConfig['state']['theme'],
  Value
>

export const useOvermind = createHook<ThemeConfig>()
