import { action } from 'overmind'
import { Operator } from '../app'

export const setInterval: Operator<number> = action(
  ({ effects, state }, value) => {
    const { date } = effects
    console.log('SET INTERVAL', value)
    state.date.nowInterval = value
    date.restart(value)
  }
)
