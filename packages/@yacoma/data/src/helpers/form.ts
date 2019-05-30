import { Context } from '../app'

export function clearForm({ state }: { state: Context['state'] }) {
  state.data.login.wordList = []
  state.data.login.wordListVerify = []
  state.data.login.username = ''
  state.data.login.email = ''
  state.data.login.admin = false
  state.data.login.protected = false
}
