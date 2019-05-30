import { action } from 'overmind'
import { helper } from '@yacoma/security'
import { Operator } from '../app'

export const toggleCollectionAccess: Operator<{
  collectionId: string
}> = action((ctx, value) => {
  const { state } = ctx
  const { current, form } = state.document
  const currentUser = state.data.auth
  if (!current) {
    return
  }
  const item = current.raw
  if (!helper.canEditAccess(currentUser, item)) {
    // UI issue: should not allow click
    return
  }
  const { collectionId } = value
  const formValue = form.collectionAccess[collectionId]
  const currentAccess = !!item.collectionAccess[collectionId]

  if (formValue === undefined) {
    form.collectionAccess[collectionId] = !currentAccess
  } else {
    // Undo change
    delete form.collectionAccess[collectionId]
  }
  form.changed =
    Object.keys(form.collectionAccess).length > 0 ||
    Object.keys(form.userAccess).length > 0
})
