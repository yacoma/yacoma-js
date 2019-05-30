import { action } from 'overmind'
import { Operator } from '../app'

export const set: Operator<string> = action(
  ({ state }, value) => (state.locale.lang = value)
)
