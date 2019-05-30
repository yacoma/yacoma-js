import * as crypt from './'

let wordList: string[]

describe('keys', () => {
  beforeAll(async () => {
    wordList = ['boyfriend', 'fruit', 'banjo', 'enjoy', 'palace', 'software']
  })

  it('should create key from word list', async () => {
    const key = await crypt.encryptionKeyFromWordList(wordList)
    expect(key.encrypt.length).toBe((16 * 3) / 2) // base64 overhead
    expect(key.encrypt).toBe('mKTPLg8WX1VCgMxBTPwfBQ==')
  })
})
