import { DocumentLink as component, DocumentLinkProps as Props } from '../..'
import { config, Stories } from '../helper'

export const documentLink: Stories<Props> = {
  name: 'DocumentLink',
  config,
  component,
  stories: [
    {
      name: 'simple',
      props: {
        id: 'i.foo',
        collectionId: 'c.notSharedCollId',
      },
    },

    /*
    {
      name: 'paragraph id',
      props: {
        id: 'i.foo',
        paragraphId: 'efbc',
        collectionId: 'c.notSharedCollId',
        title: 'some paragraph blah blah',
      },
    },

    {
      name: 'with title',
      props: {
        id: 'i.foo',
        collectionId: 'c.notSharedCollId',
        title: 'custom title',
      },
    },
*/
    {
      name: 'onRemove',
      props: {
        id: 'i.foo',
        collectionId: 'c.notSharedCollId',
        onRemove() {
          alert('on remove')
        },
      },
    },
  ],
}
