import classnames from 'classnames'
import { Context } from './app'
import { DroppableHooks, DroppableOptions } from './types'

/** Should leave 'className' inside the props passed to droppable because they
 * are modified and passed back.
 */
export function droppable<T = any>(
  ctx: Context,
  settings: DroppableOptions<T>
): DroppableHooks {
  const { drag } = ctx.state.dragdrop
  const type = drag ? drag.type : undefined
  const dragEnter = ctx.actions.dragdrop.enter
  const dragLeave = ctx.actions.dragdrop.leave
  const { drop, enable, className, onDrop, payload } = settings

  const enabled = enable === undefined || enable === true

  const dropZone = type
    ? typeof drop === 'string'
      ? drop === type
      : drop[type] === true
    : false
  const noDropKey = typeof enable === 'string' ? enable : 'noDrop'

  return {
    className: classnames(className, {
      dropZone: dropZone && enabled,
      [noDropKey]: dropZone && !enabled,
    }),

    onMouseMove(e: MouseEvent) {
      if (dropZone && enabled) {
        const target = e.target as HTMLElement
        if (!target) {
          return
        }
        if (target.classList.contains('hover')) {
          // done
          return
        }
        target.classList.add('hover')
        dragEnter({
          htmlElement: e.target as HTMLElement,
          drop: {
            // HORRIBLE Derive thing where functions are called on access.
            callback: () => onDrop,
            payload: payload || {},
          },
        })
      }
    },

    onMouseLeave(e: MouseEvent) {
      if (dropZone && enabled) {
        const target = e.target as HTMLElement
        if (!target) {
          return
        }
        target.classList.remove('hover')
        dragLeave()
      }
    },
  }
}
