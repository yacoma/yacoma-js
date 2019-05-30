import * as actions from './actions'

export type DragdropComponentType =
  | React.ComponentClass<any>
  | React.FunctionComponent<any>

export interface DragdropDefinitions {
  [type: string]: {
    hooks?: Partial<DragdropHooks>
    component: DragdropComponentType
    // Extra props to pass to component on drag. This will not be part of the
    // payload. Used to alter behavior or visual of dragged element for example.
    dragProps?: any
    // Fixed dragging position in component
    anchor?: Position
  }
}

export interface DragdropSettings {
  // Dragdrop components where we show the rest of the app.
  dragdrop?: DragdropDefinitions
}

export interface DragData<Payload = any> {
  // Anchor in dragged object
  anchor: Position
  // When a drag is happening, this is set with the type of dragged element.
  // Drop zones react to this type by changing style to show if they accept it.
  type: string
  // Any kind of information related to the given type that helps the drop zone
  // know what to do with it.
  payload: Payload
}

export interface DropData<Payload = any> {
  // When the drag ends, this is called (set when hovering above a Drop element). The
  // call is async and will behave as if it was called from the Drop target.
  // No need for the extra function wrapping to avoid Derive because type is optional.
  callback: OnDropFunction
  // Information on drop added.
  payload: Payload
}

export interface Position {
  x: number
  y: number
}

// Hooks triggered in dragdrop actions

// Hooks inserted in UI component
export interface DraggableHooks {
  onClick(e: any): any
  // This is for very small draggable items (we cannot start drag before being outside of element)
  onMouseLeave(e: any): any
  onMouseUp(e: any): any
  onMouseDown(e: any): any
  onMouseMove(e: any): any
}

export interface DraggableOptions {
  onClick?: () => void
  // When this flag is set to true, dragging is disabled.
  noDrag?: boolean
}

export interface DroppableHooks {
  // Detect mouse enter, also on initial drag zone if drag starts there.
  onMouseMove(e: any): any
  onMouseLeave(e: any): any
  className: string
}

export interface FileDroppableHooks {
  // Just to make sure it is inserted in the HTML element.
  ref: React.RefObject<any>
  onDrop(e: any): any
  onDragEnter(e: any): any
  onDragOver(e: any): any
  onDragLeave(e: any): any
}

export interface DroppableOptions<T = any> {
  className?: string
  // Is the drop enabled ? If the value is a `string`, this is used as
  // extra className to explain why it is disabled.
  enable?: boolean | string
  // Types of draggable items to accept. Use a single string to accept just one type.
  drop: { [key: string]: boolean } | string
  onDrop: (dragPayload: any) => void
  // Extra payload to add to draggable payload (can provide context).
  payload?: T
}

export interface FileDroppableOptions {
  // We need to use a ref as the drag operations do not touch
  // overmind and we need to update the div.
  ref: React.RefObject<HTMLElement>
  className?: string
  accept?: (file: File) => boolean
  onDrop: (args: { files: File[] }) => void
  // Extra payload to add
  payload?: any
}

export interface DragdropState {}

export type OnDropFunction = (dragPayload: any) => void

export interface DragdropHooks {
  enter: (ctx: any, value: actions.EnterArg) => any
  leave: (ctx: any) => any
  move: (ctx: any, value: actions.MoveArg) => any
  release: (ctx: any) => any
  start: (ctx: any, value: actions.StartArg) => any
}

export interface DragdropConfig {
  state: {
    dragdrop: {
      // Dragged data
      drag?: DragData
      // Mouse position
      position: Position
      drop?: DropData
      // () => Derive, () => Block proxify.
      definitions: () => () => DragdropDefinitions
    }
    data: {
      uploadLimit?: number
    }
  }

  actions: {
    dragdrop: typeof actions
  }
}
