import {
  ItemIcon as component,
  ItemIconProps as Props,
  documentTheme,
} from '../..'
import { config, Stories } from '../helper'

export const collectionIcon: Stories<Props> = {
  name: 'ItemIcon',
  config,
  theme: documentTheme,
  component,
  stories: [
    {
      name: 'Item',
      props: {
        item: {
          id: 'i.foo',
          type: 'Item',
          title: 'item title',
          raw: {
            collectionAccess: {},
          },
        } as any,
      },
    },

    {
      name: 'Collection',
      props: {
        item: {
          id: 'c.barStuffId',
          type: 'Collection',
          title: 'some collection title',
          raw: {
            userAccess: {
              uid: 'foo',
            },
          },
        } as any,
      },
    },

    {
      name: 'Shared Collection',
      props: {
        item: {
          id: 'c.barStuffId',
          type: 'Collection',
          title: 'some collection title',
          raw: {
            userAccess: {
              uid: 'foo',
              otherUid: 'bar',
            },
            collectionAccess: {},
          },
        } as any,
      },
    },

    {
      name: 'Private collection',
      props: {
        item: {
          id: 'p.uid',
          type: 'Collection',
          title: 'collectionTitle',
          raw: {
            userAccess: {
              uid: 'foo',
            },
          },
        } as any,
      },
    },

    {
      name: 'Own project',
      props: {
        item: {
          id: 'w.uid',
          type: 'Collection',
          title: 'collectionTitle',
          raw: {
            userAccess: {
              uid: 'foo',
            },
          },
        } as any,
      },
    },

    {
      name: 'User project',
      state: {
        db: {
          User: {
            bob: {
              username: 'Bob',
            },
          },
        },
      },

      props: {
        item: {
          id: 'w.bob',
          type: 'Collection',
          title: 'collectionTitle',
          raw: {
            userAccess: {
              uid: 'foo',
              bob: 'foo',
            },
          },
        } as any,
      },
    },
  ],
}
