import { Input as component, InputProps as Props } from '../..'
import { config, Stories } from '../helpers'
import { RoundInput } from '../..'
import { action } from 'overmind'

function randomWord() {
  return Array.from({ length: 8 })
    .map(() => String.fromCharCode(97 + Math.floor(26 * Math.random())))
    .join('')
}

export const inputStories: Stories<Props> = {
  name: 'Input',
  component,
  config,
  stories: [
    {
      name: 'simplest',
      fprops: ({ state }) => ({ form: state.login, name: 'username' }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'RoundInput',
      component: RoundInput,
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        reset: true,
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'submit',
      titleClick: action(
        ({ state }) => (state.login.username = Math.random().toString())
      ),
      fprops: app => ({
        form: app.state.login,
        name: 'username',
        submit: app.actions.login.submit,
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'placeholder',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        placeholder: 'enterUsername',
      }),
      state: {
        login: {
          username: '',
        },
      },
    },

    {
      name: 'placeholder true',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        placeholder: true,
      }),
      state: {
        login: {
          username: '',
        },
      },
    },

    {
      name: 'password',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'password',
        type: 'password',
      }),
      state: {
        login: {
          password: '',
        },
      },
    },

    {
      name: 'checkbox',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'admin',
        type: 'checkbox',
      }),
      state: {
        login: {
          password: '',
        },
      },
    },

    {
      name: 'reset',
      fprops: ({ state }) => ({
        form: state.login,
        reset: true,
        name: 'username',
      }),
      state: {
        login: {
          username: '',
        },
      },
    },

    {
      name: 'resetIcon',
      fprops: ({ actions, state }) => ({
        form: state.login,
        reset: true,
        resetIcon: 'RefreshField',
        onReset() {
          const value = randomWord()
          actions.styled.valueChanged({
            form: state.login,
            name: 'username',
            value,
          })
        },
        name: 'username',
      }),
      state: {
        login: {
          username: randomWord(),
        },
      },
    },

    {
      name: 'reset visible',
      fprops: ({ state }) => ({
        form: state.login,
        reset: true,
        name: 'username',
      }),
      state: {
        login: {
          username: 'some name',
        },
      },
    },
  ],
}
