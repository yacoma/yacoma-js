import { build } from '@lucidogen/build'
import { dialog } from '@lucidogen/dialog'
import { locale } from '@lucidogen/locale'
import { TStories } from '@lucidogen/story'
import { styled } from '@lucidogen/styled'
import { theme } from '@lucidogen/theme'
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
