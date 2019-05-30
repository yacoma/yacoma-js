import { action } from 'overmind'
import { helper } from '@yacoma/security'
import { Operator } from '../app'

export const toggleUserAccess: Operator<{
  userId: string
  access: 'a' | 'e'
}> = action((ctx, value) => {
  const { state } = ctx
  const { access, userId } = value

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

  let currentValue = ''
  const currentAccess = (item.userAccess[userId] || { access: 'r' }).access
  if (currentAccess.includes('a')) {
    currentValue = 'a'
  } else if (currentAccess.includes('e')) {
    currentValue = 'e'
  } else if (currentAccess.includes('r')) {
    currentValue = 'r'
  }

  const formValue = form.userAccess[userId]

  if (access === formValue || access === currentValue) {
    if (currentValue !== 'r') {
      // User becomes just a reader. Since there was another value, remove
      // user access.
      form.userAccess[userId] = false
    } else {
      delete form.userAccess[userId]
    }
  } else {
    form.userAccess[userId] = access
  }
  form.changed =
    Object.keys(form.collectionAccess).length > 0 ||
    Object.keys(form.userAccess).length > 0
})
