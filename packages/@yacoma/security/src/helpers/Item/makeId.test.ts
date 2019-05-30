import * as crypt from '@yacoma/crypt'
import * as security from '../../'
import { mockRandomValues, restore } from '../../test'
import { ItemTypes } from '../../types'

const ID_LEN = (33 * 4) / 3 + 2

describe('makeId', () => {
  beforeEach(mockRandomValues)
  afterEach(restore)

  it('should generate a random item id', () => {
    const id = security.itemId()
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('i.')
  })

  it('should generate a random message id', () => {
    const id = security.messageId()
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('m.')
  })

  it('should generate a random file id', () => {
    const id = security.fileId()
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('f.')
  })

  it('should generate a random collection id', () => {
    const id = security.collectionId()
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('c.')
  })

  it('should generate a pair collection id', () => {
    const userId = crypt.makeId()
    const otherUserId = crypt.makeId()
    const pairCollectionId = security.pairCollectionId(userId, otherUserId)
    expect(pairCollectionId.length).toBe(46)
    expect(pairCollectionId.slice(0, 2)).toBe('d.')
    expect(security.isPairCollectionId(pairCollectionId)).toBe(true)
  })

  it('should generate a private collection id from userId', () => {
    const userId = crypt.makeId()
    const id = security.privateCollectionId(userId)
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('p.')
  })

  it('should throw when generate a private collection id not from userId', () => {
    const userId = crypt.makeId()
    const workCollectionId = security.workCollectionId(userId)
    expect(() => security.privateCollectionId(workCollectionId)).toThrow(
      'PrivateCollectionId can only be created from userId.'
    )
  })

  it('should generate a contact id from userId', () => {
    const userId = crypt.makeId()
    const id = security.contactId(userId)
    expect(security.isContactId(id)).toBe(true)
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('a.')
  })

  it('should throw when generating a contact id not from userId', () => {
    const userId = crypt.makeId()
    const workCollectionId = security.workCollectionId(userId)
    expect(() => security.contactId(workCollectionId)).toThrow(
      'ContactId can only be created from userId.'
    )
  })

  it('should generate a work collection id from userId', () => {
    const userId = crypt.makeId()
    const id = security.workCollectionId(userId)
    expect(id.length).toBe(ID_LEN)
    expect(id.slice(0, 2)).toBe('w.')
  })

  it('should throw when generate a work collection id not from userId', () => {
    const userId = crypt.makeId()
    const privateCollectionId = security.privateCollectionId(userId)
    expect(() => security.workCollectionId(privateCollectionId)).toThrow(
      'WorkCollectionId can only be created from userId.'
    )
  })

  it('should generate a random user id', () => {
    const id = crypt.makeId()
    expect(id.length).toBe(ID_LEN - 2)
  })

  it('should extract user id from private collection id', () => {
    const userId = 'some user id'
    const privateCollectionId = security.privateCollectionId(userId)
    const id = security.extractUserId(privateCollectionId)
    expect(id).toBe(userId)
  })

  it('should throw when extracting userId from wrong id', () => {
    const collectionId = security.collectionId()
    expect(() => security.extractUserId(collectionId)).toThrow(
      'UserId can only be extracted from privateCollectionId or workCollectionId.'
    )
  })

  it('should extract user id from work collection id', () => {
    const userId = 'some user id'
    const workCollectionId = security.workCollectionId(userId)
    const id = security.extractUserId(workCollectionId)
    expect(id).toBe(userId)
  })

  it('should extract user id from contact id', () => {
    const userId = 'some user id'
    const contactId = security.contactId(userId)
    const id = security.extractUserId(contactId)
    expect(id).toBe(userId)
  })

  it('should create id for type', () => {
    const list: ItemTypes[] = ['Item', 'File', 'Message', 'Collection']
    expect(list.map(security.idForType).map(security.typeFromId)).toEqual(list)
  })
})
