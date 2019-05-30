import { WORD_COUNT } from '@yacoma/security'
import { Derive } from '../app'
import { DataConfig } from '../types'

export const valid: Derive<
  DataConfig['state']['data']['login'],
  boolean
> = parent => {
  const { wordList, wordListVerify } = parent
  for (let idx = 0; idx < WORD_COUNT; ++idx) {
    if (wordListVerify[idx] !== wordList[idx]) {
      return false
    }
  }
  return parent.nameValid
}
