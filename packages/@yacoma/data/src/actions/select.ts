import { action } from 'overmind'
import { Operator } from '../app'
import { SelectedDocument } from '../types'

export const select: Operator<SelectedDocument | undefined> = action(
  async (ctx, value) => {
    const { state, effects } = ctx
    const { hooks } = effects
    await hooks.run('data_select', ctx, value, () => {
      if (!value) {
        delete state.document.selected
        return
      }
      if (state.document.selected && state.document.selected.id === value.id) {
        delete state.document.selected
      } else {
        state.document.selected = Object.assign({}, value)
      }
      if (state.styled.show['navigation']['search']) {
        // Auto select collectionId
        ctx.actions.data.selectCollection(value.collectionId)
      }
    })
  }
)
