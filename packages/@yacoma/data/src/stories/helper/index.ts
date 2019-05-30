import { build } from '@yacoma/build'
import { dialog } from '@yacoma/dialog'
import { locale } from '@yacoma/locale'
import { TStories } from '@yacoma/story'
import { styled } from '@yacoma/styled'
import { theme } from '@yacoma/theme'
import { data } from '../..'

export const wordList = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
]

export const config = build({
  name: 'test',
  state: {
    data: {
      login: {
        wordList,
      },
    },
  },
})
  .using(data)
  .using(theme)
  .using(dialog)
  .using(locale)
  .using(styled)
  .config()

export type Stories<Props> = TStories<typeof config, Props>
