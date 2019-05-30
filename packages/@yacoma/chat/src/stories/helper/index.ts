import { build, settings } from '@lucidogen/build'
import { data } from '@lucidogen/data'
import { date } from '@lucidogen/date'
import { dialog } from '@lucidogen/dialog'
import { document } from '@lucidogen/document'
import { dragdrop } from '@lucidogen/dragdrop'
import { locale, LocaleSettings } from '@lucidogen/locale'
import { TStories } from '@lucidogen/story'
import { styled, StyledSettings } from '@lucidogen/styled'
import { theme } from '@lucidogen/theme'
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
