import { Block, settings } from '@lucidogen/build'
import { dialog, DialogSettings } from '@lucidogen/dialog'
import { locale, LocaleSettings } from '@lucidogen/locale'
import { styled, StyledSettings } from '@lucidogen/styled'
import { current } from './derived'
import * as actions from './actions'
import {
  ContactCreate,
  ContactPrint,
  RegisterName,
  RegisterVerify,
  RegisterWords,
  WordLogin,
  Offline,
} from './components'
import { nameValid, valid } from './derive'
import { icons } from './icons'
import { setup } from './setup'
import { onInitialize } from './onInitialize'
import { DataConfig } from './types'

export * from './components'
export * from './dataTypes'
export * from './helpers'
export * from './types'

export function gql(strings: TemplateStringsArray, ...values: any[]) {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export const data: Block<DataConfig> = {
  name: 'data',
  dependencies: [locale, styled, dialog],
  setup,
  onInitialize,
  settings: settings<LocaleSettings & DialogSettings & StyledSettings>({
    dialog: {
      overlay: {
        ContactCreate,
        Offline,
        Login: WordLogin,
        Register: RegisterName,
        RegisterWords,
        RegisterVerify,
      },
      exclusive: {
        ContactPrint,
      },
    },
    locale: {
      en: {
        adminCheckbox: 'admin',
        protectedCheckbox: 'protected',
        username: 'username',
        email: 'email',
        wordList: 'Word list',
        Back: 'Back',
        Cancel: 'Cancel',
        Close: 'Close',
        Print: 'Print',
        Continue: 'Continue',
        CouldNotLogin: 'Could not login.',
        Create: 'Create',
        ContactCreateMessage:
          'Please fill in the fields to create a new contact.',
        ContactCreateTitle: 'Create new contact',
        ContactPrintMessage:
          "Contact '{username}' successfully created ! You should now print this page in order to save the word list (it will not be shown again).",
        ContactPrintTitle: '{username}',
        InvalidUsernameOrEmail: 'Invalid username or email.',
        Loading: 'Loading',
        Login: 'Login',
        LoginTitle: 'Login',
        LoginMessage: 'Please login with your secret word list.',
        Offline: 'Remote server is offline.',
        Register: 'Register',
        RegisterTitle: 'Registration',
        RegisterNameMessage:
          'Please choose a username (cannot be changed) and enter your email.',
        RegisterWordsMessage:
          '{username} ({email}), here is the secret word list that you will need to login on a new machine. You can change some of the words if you want. Please write this list somewhere safe (you will not see it again).',
        RegisterVerifyMessage:
          '{username} ({email}), please enter your secret word list for verification here.',
        WordListDoesNotMatch: 'Word list does not match secret list.',
        emailPlaceholder: 'Contact email...',
        usernamePlaceholder: 'Contact name...',
      },
    },
    styled: {
      icons,
    },
  }),
  state: {
    document: {
      search: '',
      view: 'files',
      current,
    },
    data: {
      login: {
        username: '',
        email: '',
        admin: false,
        protected: false,
        wordList: [],
        wordListVerify: [],
        error: undefined,
        valid,
        nameValid,
      },
      auth: {
        id: '',
        type: 'User',
        username: '',
        domain: '',
        savedAt: '',
        publicKeys: '',
        privateKeys: '',
      },
      uploadLimit: 4 * 1000 * 1000, // 4MB
    },
    fileCache: {},
    db: {
      Collection: {},
      PairCollection: {},
      WorkCollection: {},
      PrivateCollection: {},
      Item: {},
      Contact: {},
      File: {},
      User: {},
    },
    msgDb: {},
  },
  actions: {
    data: actions,
  },
  // real effects is set by `setup`
  effects: {
    data: {} as any,
  },
}
