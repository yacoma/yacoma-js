import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mockRandomValues,
  restore,
} from 'test'

import * as crypt from './'
import { base64ToBuffer } from './encoding'

describe('makeId', () => {
  beforeEach(mockRandomValues)
  afterEach(restore)

  it('should generate a random id', () => {
    const id = crypt.makeId(30)
    expect(base64ToBuffer(id).length).toBe(30)
  })

  it('should generate a random id of default length', () => {
    const id = crypt.makeId()
    expect(base64ToBuffer(id).length).toBe(33)
  })
})
