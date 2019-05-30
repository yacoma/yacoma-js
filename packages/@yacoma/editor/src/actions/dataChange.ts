import { Operator } from '../app'
import { DataChangeArgs } from '../lib/utils/types'
import { action } from 'overmind'

export const dataChange: Operator<DataChangeArgs> = action((_, value) => {
  Object.assign(value.data, value.values)
})
