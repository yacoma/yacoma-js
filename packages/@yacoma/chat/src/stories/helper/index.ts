import { build, settings } from '@yacoma/build'
import { data } from '@yacoma/data'
import { date } from '@yacoma/date'
import { dialog } from '@yacoma/dialog'
import { document } from '@yacoma/document'
import { dragdrop } from '@yacoma/dragdrop'
import { locale, LocaleSettings } from '@yacoma/locale'
import { TStories } from '@yacoma/story'
import { styled, StyledSettings } from '@yacoma/styled'
import { theme } from '@yacoma/theme'
import { chat } from '../..'
import { testState } from './testState'

export const config = build({
  name: 'test',
  settings: settings<StyledSettings & LocaleSettings>({}),
  state: {
    document: {
      selectedView: testState.selected,
      recentViews: [],
    },
    chat: {
      recent: [testState.selected],
      draft: {
        [testState.selected.id]: {
          title: '',
          attachments: {},
        },
      },
    },
    data: {
      auth: {
        id: testState.uid,
      },
    },
    db: testState.db,
  },
})
  .using(chat)
  .using(document)
  .using(data)
  .using(dragdrop)
  .using(date)
  .using(dialog)
  .using(locale)
  .using(styled)
  .using(theme)
  .config()

export type Stories<Props> = TStories<typeof config, Props>
