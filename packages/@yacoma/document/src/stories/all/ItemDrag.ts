import { ItemDrag as component, ItemDragProps as Props } from '../..'
import { config, Stories } from '../helper'

export const itemDrag: Stories<Props> = {
  name: 'ItemDrag',
  config,
  component,
  stories: [
    {
      name: 'Item',
      props: {
        id: 'i.foo',
        type: 'Item',
      },
    },

    {
      name: 'Collection',
      props: {
        id: 'c.sharedCollId',
        type: 'Collection',
      },
    },
  ],
}
