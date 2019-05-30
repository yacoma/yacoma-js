/* eslint-disable @typescript-eslint/no-unused-vars */
import * as validate from './'

/*
When a user replaces his or her `invite` with his or her `key` and does not
change any other fields (not even the accessChangedByian and accessChangedAt fields), we accept
the write operation. We require a new entry in the **accessChangeLog** with `join`
operation.
*/
describe('Collection.userAccess.$id.invite', () => {
  it('should x', () => {
    expect(true).toBe(true)
  })
})

/*
Once an invitation has been accepted, this contains the collection key encrypted
with the user's master key.
*/
describe('Collection.users.$id.key', () => {
  it('should x', () => {
    //
  })
})
