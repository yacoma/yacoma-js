import { Operator } from './app'
import * as effects from './effects'
import {
  ApplyOpArgs,
  CompositionArgs,
  CompositionSelectionArgs,
  DataChangeArgs,
  EditorOptions,
  EditorProvider,
  EnterPressArgs,
  InputChangeArgs,
  PasteDocumentArgs,
  SelectChangeArgs,
  SizeChangeArgs,
  TitleChangeArgs,
} from './lib/utils/types'

export interface EditorConfig {
  state: {
    editor: {
      // Internal
      options: () => () => EditorProvider
    }
  }
  // effects: EditorProviders
  actions: {
    editor: {
      applyOp: Operator<ApplyOpArgs, any>
      backspacePress: Operator<CompositionSelectionArgs, any>
      clearToolbox: Operator<CompositionArgs, any>
      dataChange: Operator<DataChangeArgs, any>
      enterPress: Operator<EnterPressArgs, any>
      inputChange: Operator<InputChangeArgs, any>
      titleChange: Operator<TitleChangeArgs, any>
      pasteDocument: Operator<PasteDocumentArgs, any>
      selectChange: Operator<SelectChangeArgs, any>
      sizeChange: Operator<SizeChangeArgs, any>
    }
  }
  effects: {
    editor: typeof effects
  }
}

export interface EditorSettings {
  editor?: EditorOptions
}
