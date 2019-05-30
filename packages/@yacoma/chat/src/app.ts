import { IContext, IDerive, IOperator, IState } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { DataConfig } from '@yacoma/data'
import { DialogConfig } from '@yacoma/dialog'
import { DocumentConfig, documentTheme } from '@yacoma/document'
import { DragdropConfig } from '@yacoma/dragdrop'
import { EditorConfig } from '@yacoma/editor'
import { HooksConfig } from '@yacoma/hooks'
import { LocaleConfig } from '@yacoma/locale'
import { StyledConfig, styledTheme } from '@yacoma/styled'
import { ThemeConfig, themeProxy } from '@yacoma/theme'
import { chatTheme } from './theme'
import { ChatConfig } from './types'

export { styled, Comp }

export const allThemes = Object.assign(
  {},
  chatTheme,
  documentTheme,
  styledTheme
)
export const theme = themeProxy(allThemes)

export type Config = ChatConfig &
  DataConfig &
  DialogConfig &
  DocumentConfig &
  EditorConfig &
  HooksConfig &
  DragdropConfig &
  LocaleConfig &
  ThemeConfig &
  StyledConfig

export type Context = IContext<Config>
export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export type Derive<Parent extends IState = any, Value = any> = IDerive<
  Config,
  Parent,
  Value
>

export const useOvermind = createHook<Config>()
