import { action } from 'overmind'
import { Operator } from '../app'

export const selectCollection: Operator<string | undefined> = action(
  (ctx, value) => {
    const { state } = ctx
    if (!value) {
      delete state.document.selectedCollectionId
      return
    }

    if (
      !state.styled.show['navigation']['search'] &&
      state.document.selectedCollectionId === value
    ) {
      delete state.document.selectedCollectionId
    } else {
      state.document.selectedCollectionId = value
      delete state.styled.show['navigation']['search']
    }
  }
)
