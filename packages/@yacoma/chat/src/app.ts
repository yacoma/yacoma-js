import { DataConfig } from '@lucidogen/data'
import { DialogConfig } from '@lucidogen/dialog'
import { DocumentConfig, documentTheme } from '@lucidogen/document'
import { DragdropConfig } from '@lucidogen/dragdrop'
import { EditorConfig } from '@lucidogen/editor'
import { HooksConfig } from '@lucidogen/hooks'
import { LocaleConfig } from '@lucidogen/locale'
import { StyledConfig, styledTheme } from '@lucidogen/styled'
import { ThemeConfig, themeProxy } from '@lucidogen/theme'
import { IContext, IDerive, IOperator, IState } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
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
