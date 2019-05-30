import { Derive } from '../app'
import { DataConfig } from '../types'

export const nameValid: Derive<
  DataConfig['state']['data']['login'],
  boolean
> = parent => {
  const { username, email } = parent
  // TODO: better validation maybe
  return !!(username && email)
}
