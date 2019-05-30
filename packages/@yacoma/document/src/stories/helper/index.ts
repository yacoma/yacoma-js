import { action } from 'overmind'
import { build, settings } from '@yacoma/build'
// import { chat } from '@yacoma/chat'
import { data, DataSettings } from '@yacoma/data'
import { date } from '@yacoma/date'
import { dialog } from '@yacoma/dialog'
import { dragdrop } from '@yacoma/dragdrop'
import { editor } from '@yacoma/editor'
import { locale, LocaleSettings } from '@yacoma/locale'
import { TStories } from '@yacoma/story'
import { styled, StyledSettings } from '@yacoma/styled'
import { theme } from '@yacoma/theme'
import { document } from '../..'

export const config = build({
  name: 'test',
  settings: settings<DataSettings & StyledSettings & LocaleSettings>({
    data: {
      skipInit: true,
    },
  }),
  state: {
    document: {
      selected: {
        id: 'i.foo',
        collectionId: 'c.notSharedCollId',
      },
    },
    data: {
      auth: {
        id: 'uid',
      },
    },
    db: {
      WorkCollection: {
        'w.uid': {
          id: 'w.uid',
          type: 'WorkCollection',
          title: 'my work',
          raw: {
            userAccess: {
              uid: 'foo',
            },
          },
        },
      },
      PrivateCollection: {
        'p.uid': {
          id: 'p.uid',
          type: 'PrivateCollection',
          title: 'private',
          raw: {
            userAccess: {
              uid: { access: 'aer' },
            },
          },
        },
      },
      Collection: {
        'c.notSharedCollId': {
          id: 'c.notSharedCollId',
          type: 'Collection',
          title: 'my bar stuff',
          raw: {
            userAccess: {
              uid: {
                access: 'aer',
              },
            },
          },
        },
        'c.sharedCollId': {
          id: 'c.sharedCollId',
          type: 'Collection',
          title: 'shared collection',
          raw: {
            userAccess: {
              uid: { access: 'r' },
              bob: { access: 'er' },
            },
          },
        },
        'c.asharedCollId': {
          id: 'c.asharedCollId',
          type: 'Collection',
          title: 'another shared collection',
          raw: {
            userAccess: {
              uid: { access: 'r' },
              bob: { access: 'er' },
            },
          },
        },
      },
      Item: {
        'i.foo': {
          id: 'i.foo',
          title: 'Foo',
          type: 'Item',
          raw: {
            collectionAccess: {
              'c.notSharedCollId': 'cryptkey',
            },
            userAccess: {
              uid: {
                access: 'aer',
              },
              mary: {
                access: 'er',
              },
              bob: {
                access: 'r',
              },
            },
          },
        },

        'i.bar': {
          id: 'i.bar',
          title: 'Bar',
          type: 'Item',
          raw: {
            collectionAccess: {
              'p.uid': 'cryptkey',
            },
          },
        },

        'f.file': {
          id: 'f.file',
          title: 'Some bar file',
          type: 'File',
          $uploaded: 0.5,
          fileId: 'someFileId',
          fileType: 'image/jpeg',
          raw: {
            collectionAccess: {
              'p.uid': 'cryptkey',
            },
          },
        },

        'i.baz': {
          id: 'i.baz',
          title: 'Baz machin',
          type: 'Item',
          raw: {
            collectionAccess: {
              'c.notSharedCollId': 'cryptkey',
            },
          },
        },
        'i.blah': {
          id: 'i.blah',
          title: 'Blah share',
          type: 'Item',
          raw: {
            userAccess: {
              uid: { access: 'aer' },
            },
            collectionAccess: {
              'c.notSharedCollId': 'cryptkey',
              'c.sharedCollId': 'cryptkey',
            },
          },
        },
      },
      User: {
        uid: {
          username: 'Gaspard',
        },
        bob: {
          username: 'Bob',
        },
        mary: {
          username: 'Mary',
        },
      },
    },
  },
  actions: {
    chat: {
      shareItem: action(() => {}),
    },
  },
})
  .using(document)
  //  .using(chat)
  .using(data)
  .using(date)
  .using(dragdrop)
  .using(dialog)
  .using(editor)
  .using(locale)
  .using(styled)
  .using(theme)
  .config()

export type Stories<Props> = TStories<typeof config, Props>
