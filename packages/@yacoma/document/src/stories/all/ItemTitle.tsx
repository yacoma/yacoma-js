import { ItemTitle as component, ItemTitleProps as Props } from '../..'
import { config, Stories } from '../helper'

export const collectionName: Stories<Props> = {
  name: 'ItemName',
  config,
  component,
  stories: [
    {
      name: 'Item',
      props: {
        item: {
          id: 'i.foo',
          type: 'Item',
          title: 'item title',
        } as any,
      },
    },

    {
      name: 'Collection',
      props: {
        item: {
          id: 'c.notSharedCollId',
          type: 'Collection',
          title: 'some collection title',
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
        } as any,
      },
    },
  ],
}
