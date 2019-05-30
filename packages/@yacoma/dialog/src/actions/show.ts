import { action } from 'overmind'
import { Operator } from '../app'
import * as helpers from '../helpers'

export const show: Operator<string> = action(helpers.show)
