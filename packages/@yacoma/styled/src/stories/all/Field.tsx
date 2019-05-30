import { Field as component, FieldProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const fieldStories: Stories<Props> = {
  name: 'Field',
  component,
  config,
  stories: [
    {
      name: 'simple',
      fprops: ({ state }) => ({ form: state.login, name: 'username' }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'checkbox',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'admin',
        type: 'checkbox',
        label: true,
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'submit',
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
      name: 'field icon',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: 'user',
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'field icon true',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: true,
      }),
      state: {
        login: {
          password: '',
        },
      },
    },

    {
      name: 'field disabled reset',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        disabled: true,
        reset: true,
        resetIcon: 'username',
        icon: true,
      }),
      state: {
        login: {
          username: 'Hello',
        },
      },
    },

    {
      name: 'huge fieldBorderRadius',
      fprops: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: 'user',
      }),
      state: {
        login: {
          username: 'John Lily',
        },
      },
      theme: {
        fieldBorderRadius: '15px',
      },
    },
  ],
}
