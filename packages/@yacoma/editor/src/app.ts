import { IContext, IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { LocaleConfig } from '@yacoma/locale'
import { StyledConfig, styledDefaultTheme } from '@yacoma/styled'
import { ThemeConfig, themeProxy } from '@yacoma/theme'
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
