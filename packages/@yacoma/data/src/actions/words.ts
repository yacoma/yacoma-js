import { Operator } from '../app'
import { action } from 'overmind'

export const wordChanged: Operator<{
  form: { [key: string]: any }
  name: string
  value: string
}> = action((_, arg) => {
  const { form, name, value } = arg
  if (name === '0' && value.includes(' ')) {
    value.split(' ').forEach((word, idx) => {
      form[idx] = word
    })
  } else {
    form[name] = value
  }
})
