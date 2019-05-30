import { mockRandomValues, restore } from '../test'
import { privateCollectionId } from './Item/makeId'
import { createUser } from './User'

describe('createUser', () => {
  beforeEach(mockRandomValues)
  afterEach(restore)

  it('should create user and collections', async () => {
    const wordList = ['boyfriend', 'fruit']
    const { user, privateCollection } = await createUser(wordList)
    expect(privateCollection.id).toBe(privateCollectionId(user.id))
    expect(Object.keys(user.collectionKeys)).toEqual(['p.' + user.id])
    expect(Object.keys(user.collections)).toEqual(['p.' + user.id])
  })

  it('should copy info into user', async () => {
    const { user } = await createUser(['love', 'bugs'], {
      username: 'hoho',
      domain: 'bar',
    })
    expect(user.domain).toBe('bar')
  })
})
