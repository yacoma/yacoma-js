import * as React from 'react'
import { Comp, Context } from '../../app'

// ============== Composition definition

export type PathType = string[]

export interface ElementsType {
  [key: string]: ElementType
}

// Used during page preview

export interface ElementSize {
  // Content with padding.
  content: number
  topMargin: number
  bottomMargin: number
}

export interface ElementSizes {
  [key: string]: ElementSize
}

export interface PositionedElementType {
  p: number
}

export interface PositionedElementsType {
  [key: string]: PositionedElementType
}

export interface ElementOptionsType {
  h?: number
  href?: string
  // When this is set, special behavior apply like
  // - cannot remove
  // - cannot change paragraph
  // - cannot set bold/etc (no toolbox)
  title?: boolean
}

export interface ParagraphOptions {
  // Custom tag
  c?: string
  // Options for display paragraphs
  o?: ElementOptionsType
}

export interface GroupElementRefTypeById {
  [key: string]: GroupElementRefType
}

export interface GroupElementRefType {
  path: PathType
  elem: GroupElementType
}

export interface ElementType extends ParagraphOptions {
  // Type
  t: string
  // Position
  p: number
  // Inner content (string)
  i?: string
  // Selection
  s?: SelectionType
  // Group
  g?: ElementsType
}

export interface StringElementType extends ElementType {
  i: string
}

export interface GroupElementType extends ElementType {
  g: ElementsType
}

export interface CustomElementType extends ElementType {
  c: string
}

export interface TitleElementType extends ElementType {
  o: { h: number }
}

export function isStringElement(elem: ElementType): elem is StringElementType {
  return typeof elem.i === 'string'
}

export function isGroupElement(elem: ElementType): elem is GroupElementType {
  return typeof elem.g === 'object'
}

export function isCustomElement(elem: ElementType): elem is CustomElementType {
  return typeof elem.c === 'string'
}

export function isDocumentTitle(elem: ElementType): elem is TitleElementType {
  return (elem.o && elem.o.title) || false
}

export function isTitle(elem: ElementType): elem is TitleElementType {
  const { t, o } = elem
  return (t === 'P' && o && o.h && true) || false
}

export function isSpecialElement(
  editor: EditorProvider,
  elem: ElementType
): boolean {
  return (
    isCustomElement(elem) ||
    (isStringElement(elem) ? !!editor.getMarkup(elem.i) : false)
  )
}

export function isRangeSelection(
  selection: SelectionType
): selection is RangeSelectionType {
  return selection.type === 'Range'
}

export interface ElementRefType {
  path: PathType
  elem: ElementType
}

export interface ElementRefTypeById {
  [key: string]: ElementRefType
}

export interface StringElementRefType {
  path: PathType
  elem: StringElementType
}

export interface ElementNamedType {
  ref: string
  elem: ElementType
}

export interface CompositionType {
  sizes?: ElementSizes
  toolbox?: ToolboxOperationValueType
  // Data for custom components.
  data?: { [key: string]: any }
  g: ElementsType
  // Path to object containing selection encoded as 'key.subKey.subsubKey'
  spath?: string
  // Title of the composition (when there is one)
  title?: string
}

// ============== Selections

export interface SelectionPositionType {
  top: number
  left: number
}

export interface CaretSelectionType {
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  position: SelectionPositionType
  stringPath?: string // Only used by setSelection
  type: 'Caret'
}

export interface RangeSelectionType {
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  focusPath: PathType
  focusOffset: number
  position: SelectionPositionType
  stringPath?: string // Only used by setSelection
  type: 'Range'
}

export type SelectionType = CaretSelectionType | RangeSelectionType

export interface ChangesType {
  // Initial data for custom elements (further changes do not go through
  // editor).
  data?: { [elemId: string]: any }
  // Path of removed elements.
  deleted?: string[][]
  // Full elements.
  elements: ElementRefTypeById
  // Id of updated elements (must contain selected even if
  // not changed yet).
  updated: string[]
  // Id of elements in selection (sub-set of `updated`).
  selected: string[]
  // Special cases where we need to prepare selection/toolbox during op eval.
  selection?: SelectionType
}

// ============== Operations

export interface SelectOperationType {
  op: 'select'
  value: SelectionType
}

export interface UpdateOperationType {
  op: 'update'
  path: PathType
  value: ElementType
}

export interface UpdateOptsOperationType {
  op: 'updateOpts'
  path: PathType
  opts: ParagraphOptions
}

export interface DataOperationType {
  op: 'data'
  path: PathType
  data: any
}

export interface DeleteOperationType {
  op: 'delete'
  path: PathType
}

export interface ToolboxOpType {
  type: 'emptyParagraph' | 'paragraph' | 'selection'
  position: SelectionPositionType
}

interface ToolboxNoneType {
  type: 'none'
}

export type ToolboxOperationValueType = ToolboxOpType | ToolboxNoneType

export interface ToolboxOperationType {
  op: 'toolbox'
  value?: ToolboxOperationValueType
}

export type OperationType =
  | SelectOperationType
  | UpdateOperationType
  | UpdateOptsOperationType
  | DataOperationType
  | DeleteOperationType
  | ToolboxOperationType

export type OperationsType = OperationType[]

export interface DoOperationType {
  // Not sure about these definitions
  ref: string
  elem: ElementType
}

// =========== Editor Options

export interface TextMarkup {
  (text: string): React.ReactElement<any> | undefined
}

export interface CustomTagProps {
  // Extra tag props passed from Editor.
  customTagProps: any
  paraId: string
  // paragraph
  paragraph: CustomElementType
  // custom data
  data: { [key: string]: any }
}

type CustomTag = Comp<CustomTagProps>

export interface SimpleParagraphOption {
  // Icon to display option in toolbox and when dragging...
  icon?: string
  // ... or a span.
  toolTag?: React.ReactNode
  // Current paragraph changes
  o: ElementOptionsType
}

// Internal for now
export interface SelectParagraphOption {
  showOn: {
    paragraph?: boolean
    emptyParagraph?: boolean
    selection?: boolean
  }
  op: string
  icon?: string
  toolTag?: React.ReactNode
}

export interface InitData {
  [key: string]: any
}

export interface InitFunction {
  (ctx: { state: Context['state'] }, value: ApplyOpArgs): InitData
}

export type InitParagraph = InitData | InitFunction

export interface CustomParagraphOption {
  // Icon to display in toolbox and when dragging this paragraph...
  icon?: string
  // ... or a span.
  toolTag?: React.ReactNode
  // Initial state for the paragraph's data (if any). Should
  // be an object.
  init: InitParagraph
  // Custom tag to use for the paragraph (must be set if init).
  tag: CustomTag
  // Global widgets that need to be preloaded. These can be heavy UI elements used in a single
  // custom paragraph at a time that we cannot afford to create for every paragraph.
  preload?: Comp<any>
}

export type ParagraphOption =
  | SimpleParagraphOption
  | CustomParagraphOption
  | SelectParagraphOption

export function isSimpleParagraphOption(
  para: ParagraphOption
): para is SimpleParagraphOption {
  return (para as any).o !== undefined
}

export function isCustomParagraphOption(
  para: ParagraphOption
): para is CustomParagraphOption {
  return (para as any).init !== undefined
}

export function isSelectParagraphOption(
  para: ParagraphOption
): para is SelectParagraphOption {
  return (para as any).op !== undefined
}

export interface Paragraphs {
  [key: string]: ParagraphOption
}

export interface EditorOptions {
  paragraphs?: Paragraphs
  markup?: { [key: string]: TextMarkup }
  // Set this to true to avoid editor default paragraphs.
  noDefaults?: boolean
}

// PRIVATE
export interface ParagraphPayload {
  // Initial state for the paragraph's data (if any).
  c?: string
  // On initial paragraph, 'data' is not set in signal props
  data?: { [key: string]: any }
  o?: ElementOptionsType
}

export interface InternalParagraphOption {
  // This must be set to true for sub-compositions
  isComposition?: boolean
  // Icon for dragged paragraph.
  icon?: string
  // JSON.stringify ( ParagraphPayload )
  payload: string
  preload?: ComponentType<any>
  init?: InitParagraph
  // Tag to use for custom paragraphs.
  tag?: ComponentType<CustomTagProps>
  toolTag?: React.ReactNode
  // operation to trigger ('B', 'I', 'A', 'P', etc)
  op: string
  showOn: {
    paragraph?: boolean
    emptyParagraph?: boolean
    selection?: boolean
  }
}

type ComponentType<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>

export type GetMarkup = (
  text: string
) =>
  | {
      tag: React.ReactElement<any>
      key: string
    }
  | undefined

export interface EditorProvider {
  getPreload(): ComponentType<any>[]
  getMenuChoices(type: string): InternalParagraphOption[]
  getMarkup: GetMarkup
  getParagraph(key: string): InternalParagraphOption | undefined
}

// ACTIONS AND COMPONENT ARGS

// This is the type passed to the Editor
export interface CompositionHolder {
  id?: string
  title?: string
  $changed?: boolean
  composition?: CompositionType
}

export interface CompositionWrapper {
  composition: CompositionType
}

export interface CompositionArgs {
  holder: CompositionHolder
}

export interface ApplyOpArgs extends CompositionArgs {
  selection: SelectionType
  op: string
  opts: ParagraphPayload
}

export interface DataChangeArgs {
  data: { [key: string]: any }
  values: { [key: string]: any }
}

export interface ProcessOpsArgs extends CompositionArgs {
  ops?: OperationType[] | undefined
}

export interface CompositionSelectionArgs extends CompositionArgs {
  selection: SelectionType
}

export interface EnterPressArgs extends CompositionArgs {
  selection: SelectionType
}

export interface InputChangeArgs extends CompositionArgs {
  selection: SelectionType
  value: string | null
}

export interface TitleChangeArgs extends CompositionArgs {
  value: string
}

export interface PasteDocumentArgs extends CompositionArgs {
  text: string
}

export interface SelectChangeArgs extends CompositionArgs {
  selection: SelectionType
}

export interface SizeChangeArgs extends CompositionArgs {
  key: string
  size: ElementSize
}
