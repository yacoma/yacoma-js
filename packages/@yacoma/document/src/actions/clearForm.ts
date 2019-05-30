import { action } from 'overmind'
import { Operator } from '../app'
import * as helpers from '../effects'

export const clearForm: Operator = action(helpers.clearForm)
