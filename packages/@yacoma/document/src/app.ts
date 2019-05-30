import { IContext, IDerive, IOperator } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { DataConfig } from '@yacoma/data'
import { DialogConfig } from '@yacoma/dialog'
import { DragdropConfig } from '@yacoma/dragdrop'
import { editorTheme } from '@yacoma/editor'
import { HooksConfig } from '@yacoma/hooks'
import { LocaleConfig } from '@yacoma/locale'
import { StyledConfig, styledTheme } from '@yacoma/styled'
import { ThemeConfig, themeProxy } from '@yacoma/theme'
import { documentTheme } from './theme'
import { DocumentConfig } from './types'

export { Comp, styled }

export const allThemes = Object.assign(
  {},
  documentTheme,
  editorTheme,
  styledTheme
)
export const theme = themeProxy(allThemes)

interface ChatConfig {
  actions: {
    chat: {
      addAttachment: IOperator<any, { id: string; targetId: string }, void>
      shareItem: IOperator<any, { id: string; targetId: string }, void>
      select: IOperator<any, { id: string; force?: boolean }, void>
    }
  }
}

export type Config = DocumentConfig &
  ChatConfig &
  DataConfig &
  DialogConfig &
  DragdropConfig &
  HooksConfig &
  LocaleConfig &
  ThemeConfig &
  StyledConfig

export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export type Derive<Value> = IDerive<Config, Config['state']['document'], Value>

export const useOvermind = createHook<Config>()

export type Context = IContext<Config>
