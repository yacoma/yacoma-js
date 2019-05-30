import { DataConfig } from '@yacoma/data'
import {
  createContact,
  pairCollectionId,
  privateCollectionId,
  workCollectionId,
} from '@yacoma/security'

async function makeContact(username: string, isProtected: boolean = false) {
  const records = await createContact(undefined, [username], {
    username,
    protected: isProtected,
  })
  return {
    id: records.user.id,
    user: { id: records.user.id, type: 'User', username },
    contact: records.contact
      ? {
          id: records.contact.id,
          type: 'Contact',
          savedAt: new Date().toISOString(),
          title: username,
          raw: { userAccess: records.contact.userAccess } as any,
        }
      : undefined,
    workCollection: records.workCollection
      ? {
          id: records.workCollection.id,
          savedAt: new Date().toISOString(),
          type: 'WorkCollection',
          title: username,
          raw: { userAccess: records.workCollection.userAccess } as any,
        }
      : undefined,
  }
}

export async function db() {
  const henri = await makeContact('henri')
  const lily = await makeContact('lily', true)
  const mary = await makeContact('mary')
  const gaspard = await makeContact('henri')
  const pId = privateCollectionId(gaspard.user.id)
  const wId = workCollectionId(gaspard.user.id)
  const pairId = pairCollectionId(gaspard.user.id, mary.user.id)
  // DataConfig['state']['db'] = {
  const db = {
    Collection: {
      'c.someid': {
        id: 'c.someid',
        title: 'my bar stuff',
        type: 'Collection',
        raw: {
          userAccess: {
            [gaspard.id]: {},
            [lily.id]: {},
            [mary.id]: {},
          },
        },
      },
    },
    WorkCollection: {
      [wId]: {
        id: wId,
        title: 'my work',
        type: 'Collection',
        raw: {
          userAccess: {
            [gaspard.id]: 'foo',
            [lily.id]: 'foo',
          },
        },
      },
      [lily.workCollection!.id]: lily.workCollection,
    },
    PrivateCollection: {
      [pId]: {
        id: pId,
        title: 'my private stuff',
        type: 'Collection',
        raw: {
          userAccess: {
            [gaspard.id]: 'foo',
          },
        },
      },
    },
    PairCollection: {
      [pairId]: {
        id: pairId,
        title: 'private',
        type: 'PairCollection',
        raw: {
          userAccess: {
            [gaspard.id]: 'foo',
            [mary.id]: 'foo',
          },
        },
      },
    },
    Item: {
      'i.foo': {
        id: 'i.foo',
        type: 'Item',
        title: 'Foo',
        raw: {
          collectionAccess: {
            'c.someid': 'cryptkey',
          },
        },
      },

      'i.bar': {
        id: 'i.bar',
        type: 'Item',
        title: 'Bar',
        raw: {
          collectionAccess: {
            'p.uid': 'cryptkey',
          },
        },
      },
    },
    Contact: {
      [gaspard.contact!.id]: gaspard.contact!,
      [henri.contact!.id]: henri.contact!,
      [mary.contact!.id]: mary.contact!,
    },
    User: {
      [gaspard.user.id]: gaspard.user,
      [henri.user.id]: henri.user,
      [mary.user.id]: mary.user,
      [lily.user.id]: lily.user,
    },
  }

  const msgDb: DataConfig['state']['msgDb'] = {
    'c.someid': {},
    [pairId]: {
      'm.one': {
        id: 'm.one',
        type: 'Message',
        savedAt: '2018-11-14T19:18:27.317Z',
        title: 'Do you still love me ? 😯',
        raw: {
          createdAt: '2018-11-14T19:18:27.317Z',
          creator: mary.user.id,
        } as any,
      },
      'm.two': {
        id: 'm.two',
        title: 'Yes, I do ❤️ !',
        type: 'Message',
        savedAt: '2018-11-14T19:56:09.243Z',
        raw: {
          createdAt: '2018-11-14T19:56:09.243Z',
          creator: gaspard.user.id,
        } as any,
      },
    },
  }
  return {
    db,
    msgDb,
    selected: {
      id: pairId,
      userId: mary.user.id,
    },
    uid: gaspard.user.id,
  }
}
