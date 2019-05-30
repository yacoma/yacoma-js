import { Button as component, ButtonProps as Props, Link } from '../..'
import { config, Stories } from '../helpers'

export const buttonStories: Stories<Props> = {
  name: 'Button',
  component,
  config,
  fprops: app => ({
    textKey: 'Validate',
    onClick: app.actions.login.submit,
  }),
  stories: [
    {
      name: 'simple',
    },

    {
      name: 'primary',
      props: {
        primary: true,
      },
    },

    {
      name: 'large',
      props: {
        large: true,
      },
    },

    {
      name: 'primary large',
      props: {
        large: true,
        primary: true,
      },
    },

    {
      name: 'disabled',
      props: {
        disabled: true,
      },
    },

    {
      name: 'icon',
      props: {
        icon: 'user',
      },
    },

    {
      name: 'icon true',
      props: {
        icon: true,
      },
    },

    {
      name: 'icon large',
      props: {
        icon: 'user',
        large: true,
      },
    },

    {
      name: 'large buttonBorderRadius',
      theme: {
        buttonBorderRadius: '20px',
      },
    },

    {
      name: 'Link',
      component: Link,
    },
  ],
}
