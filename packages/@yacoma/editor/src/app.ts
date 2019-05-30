import { LocaleConfig } from '@lucidogen/locale'
import { StyledConfig, styledDefaultTheme } from '@lucidogen/styled'
import { ThemeConfig, themeProxy } from '@lucidogen/theme'
import { IContext, IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { editorTheme } from './theme'
import { EditorConfig } from './types'
export { Comp, styled }

export type Config = EditorConfig & LocaleConfig & StyledConfig & ThemeConfig

export const theme = themeProxy(
  Object.assign({}, styledDefaultTheme, editorTheme)
)

export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export const useOvermind = createHook<Config>()

export type Context = IContext<Config>
