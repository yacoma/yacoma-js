import { Operator } from './'
import { action } from 'overmind'

const submit: Operator = action(({ state }) => {
  // No props passed to submit
  console.log('SUBMIT state.login =', state.login)
})

const cancel: Operator = action(() => {
  // No props passed to submit
  console.log('CANCEL')
})

const showPayload: Operator<any> = action(({ value }) => {
  alert(`showPayload: ${JSON.stringify(value)}`)
})

const toggleOpen: Operator = action(({ state }) => {
  state.test.open = !state.test.open
})

const open: Operator = action(({ value }) => {
  console.log('chat.open', value)
})

export const chat = { open }
export const login = { submit, cancel }
export const test = {
  showPayload,
  toggleOpen,
}
