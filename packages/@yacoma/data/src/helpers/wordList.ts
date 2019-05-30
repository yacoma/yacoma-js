import { randomWords } from '@lucidogen/security'
import { Context } from '../app'

export function newWordList({ state }: { state: Context['state'] }) {
  state.data.login.wordList = randomWords('en')
}
