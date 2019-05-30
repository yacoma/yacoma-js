import { Context } from '../app'

export function clearForm({ state }: Context) {
  const { form } = state.document
  delete form.error
  form.changed = false
  form.collectionAccess = {}
  form.collectionSearch = ''
  form.message = ''
  form.userAccess = {}
  form.userSearch = ''
}
