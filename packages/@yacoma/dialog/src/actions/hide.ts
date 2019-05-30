import { Operator } from '../app'
import { action } from 'overmind'
import * as helpers from '../helpers'

export const hide: Operator<void> = action(helpers.hide)
