import { action } from 'overmind'
import { Operator } from '../app'

export const updateNow: Operator = action(({ state }) => {
  state.date.now = Date.now()
})
