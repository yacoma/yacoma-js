import { ExplorerWidget as component } from '../..'
import { config, Stories } from '../helper'

export const explorer: Stories<{}> = {
  name: 'Explorer',
  config,
  component,
  stories: [
    {
      name: 'Collections',
    },

    {
      name: 'Items',
      state: {
        document: {
          selectedView: { id: 'c.notSharedCollId' },
        },
      },
    },

    {
      name: 'Collections search: Foo',
      state: {
        document: {
          search: 'Foo',
        },
      },
    },

    {
      name: 'Collections search: bar',
      state: {
        document: {
          search: 'bar',
        },
      },
    },

    {
      name: 'Items search: Foo',
      state: {
        document: {
          search: 'Foo',
          view: 'Items',
        },
      },
    },

    {
      name: 'Items search: bar',
      state: {
        document: {
          search: 'bar',
          collectionId: 'c.notSharedCollId',
        },
      },
    },
  ],
}
