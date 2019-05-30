import { Context } from './app'
import { DragdropHooks, DraggableHooks } from './types'

const DRAG_DELTA = 10

function dist(
  start: { x: number; y: number },
  ev: React.MouseEvent<HTMLSpanElement>
): number {
  const dx = ev.clientX - start.x
  const dy = ev.clientY - start.y
  return Math.sqrt(dx * dx + dy * dy)
}

export interface DraggableSettings<T = any> {
  drag: string
  hooks?: DragdropHooks
  payload: T
  // Normal click.
  onClick?: () => void
  // Defaults to `true`. Value must be `false` to disable dragging.
  enable?: boolean
}

export function draggable<T = any>(
  ctx: Context,
  settings: DraggableSettings<T>
): Partial<DraggableHooks> {
  const dragging = ctx.state.dragdrop.drag
  const start = ctx.actions.dragdrop.start
  const dragMove = ctx.actions.dragdrop.move
  const dragEnd = ctx.actions.dragdrop.release
  const { drag, payload, enable, onClick } = settings

  if (dragging) {
    // Cannot drag another element: all hooks are noop
    return { onClick }
  }
  if (enable === false) {
    return { onClick }
  }
  let down = false
  let started = false
  let startPosition: { x: number; y: number } | undefined
  function startDrag(e: React.MouseEvent<HTMLSpanElement>, force: boolean) {
    e.preventDefault()
    const delta = startPosition ? dist(startPosition, e) : 0
    if (startPosition && (delta > DRAG_DELTA || force)) {
      const target = e.target as HTMLSpanElement
      const targetPos = target.getBoundingClientRect()
      const anchor = {
        x: startPosition.x - targetPos.left,
        y: startPosition.y - targetPos.top,
      }
      start({
        drag: {
          anchor,
          type: drag,
          payload,
        },
        position: { x: e.clientX, y: e.clientY },
      })

      function mouseMove(e: MouseEvent) {
        e.preventDefault()
        dragMove({ position: { x: e.clientX, y: e.clientY } })
      }

      function mouseUp() {
        document.body.style.cursor = 'default'
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
        dragEnd()
      }

      document.body.style.cursor = '-webkit-grabbing'
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)
    }
  }

  return {
    onMouseLeave(e: any) {
      if (down) {
        startDrag(e, true)
      } else {
        startPosition = undefined
      }
    },
    onMouseUp(e: any) {
      down = false
      startPosition = undefined
      if (onClick && !started) {
        onClick()
      }
    },
    onMouseDown(e: any) {
      down = true
      startPosition = { x: e.clientX, y: e.clientY }
    },
    onMouseMove(e: any) {
      startDrag(e, false)
    },
  }
}
