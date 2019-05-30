if (process.argv[2] === 'outputDb') {
  // npx ts-node src/stories/helper/testState.ts -- outputDb
  require('./db')
    .db()
    .then((res: any) => console.log(JSON.stringify(res, null, 2)))
}

export const testState = {
  db: {
    Collection: {
      'c.someid': {
        id: 'c.someid',
        title: 'my bar stuff',
        type: 'Collection',
        raw: {
          userAccess: {
            '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {},
            YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8: {},
            'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw': {},
          },
        },
      },
    },
    WorkCollection: {
      'w.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {
        id: 'w.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
        title: 'my work',
        type: 'Collection',
        raw: {
          userAccess: {
            '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': 'foo',
            YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8: 'foo',
          },
        },
      },
      'w.YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8': {
        id: 'w.YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8',
        savedAt: '2019-03-14T11:43:41.781Z',
        type: 'WorkCollection',
        title: 'lily',
        raw: {
          userAccess: {
            YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8: {
              access: 'aer+-',
              key:
                'AQEDQAAQO3HD6AJjDizUTpRA7Nq2MST7rODo65WZsHDz3zqnyz+n2Jv8t5TFeKKeyqKr3zyOp9nZ9TZjVV9p+U5mQ5iLDMpQ74QLzM+GQli4TCJFfJdzrW3NqRSbLa13n/HiuyRPJYkp7WB0Hez18VTureBtPZsrscIobHhfIazYmN3w9K8=',
            },
          },
        },
      },
    },
    PrivateCollection: {
      'p.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {
        id: 'p.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
        title: 'my private stuff',
        type: 'Collection',
        raw: {
          userAccess: {
            '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': 'foo',
          },
        },
      },
    },
    PairCollection: {
      'd.5hJqKtUZYP7kbZKuoX1A_EqxQb4qz02dRU_dbh9MDQkT': {
        id: 'd.5hJqKtUZYP7kbZKuoX1A_EqxQb4qz02dRU_dbh9MDQkT',
        title: 'private',
        type: 'PairCollection',
        raw: {
          userAccess: {
            '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': 'foo',
            'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw': 'foo',
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
      'a.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {
        id: 'a.5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
        type: 'Contact',
        savedAt: '2019-03-14T11:43:41.652Z',
        title: 'henri',
        raw: {
          userAccess: {
            '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {
              access: 'ae',
            },
          },
        },
      },
      'a.qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw': {
        id: 'a.qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw',
        type: 'Contact',
        savedAt: '2019-03-14T11:43:41.871Z',
        title: 'mary',
        raw: {
          userAccess: {
            'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw': {
              access: 'ae',
            },
          },
        },
      },
    },
    User: {
      '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY': {
        id: '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
        type: 'User',
        username: 'henri',
      },
      'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw': {
        id: 'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw',
        type: 'User',
        username: 'mary',
      },
      YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8: {
        id: 'YWNClSpXI0fjHEY038CDH0aCUNteRNqwtN7fiq7AOj8',
        type: 'User',
        username: 'lily',
      },
    },
  },
  msgDb: {
    'c.someid': {},
    'd.5hJqKtUZYP7kbZKuoX1A_EqxQb4qz02dRU_dbh9MDQkT': {
      'm.one': {
        id: 'm.one',
        type: 'Message',
        savedAt: '2018-11-14T19:18:27.317Z',
        title: 'Do you still love me ? 😯',
        raw: {
          createdAt: '2018-11-14T19:18:27.317Z',
          creator: 'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw',
        },
      },
      'm.two': {
        id: 'm.two',
        title: 'Yes, I do ❤️ !',
        type: 'Message',
        savedAt: '2018-11-14T19:56:09.243Z',
        raw: {
          createdAt: '2018-11-14T19:56:09.243Z',
          creator: '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
        },
      },
    },
  },
  selected: {
    id: 'd.5hJqKtUZYP7kbZKuoX1A_EqxQb4qz02dRU_dbh9MDQkT',
    userId: 'qxQb4qz02dRU_dbh9MDQkTE2YP7ZYhTHw-feaZ1Safw',
  },
  uid: '5hJqKtUZYP7kbZKuoX1A_EvsmeasRNBPH8dcHyazubY',
}
