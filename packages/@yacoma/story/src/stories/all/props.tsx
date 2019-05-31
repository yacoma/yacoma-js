import { action } from 'overmind'
import { createHook } from 'overmind-react'
import { build } from '@yacoma/build'
import { TStories } from '../..'
import { Comp } from '../../app'

declare module 'overmind' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IState extends Config {}
}

const config = build({
  name: 'app',
  state: { foo: { bar: { baz: 'baz' } } },
}).config()

const useOvermind = createHook<typeof config>()

const component: Comp<{ name: string }> = ({ name }) => {
  const app = useOvermind()
  return (
    <div>
      This is {name} ({app.state.foo.bar.baz})
    </div>
  )
}

const anon = () => {
  return <div>simple div</div>
}

export const propsStories: TStories<
  typeof config,
  {
    name: string
    bool?: boolean
    callback?: () => void
    tag?: any
    number?: number
  }
> = {
  name: 'props',
  config,
  stories: [
    {
      name: 'simple',
      component,
      props: { name: 'foo' },
    },
    {
      name: 'state change on click',
      component,
      titleClick: action(({ state }) => {
        state.foo.bar.baz = state.foo.bar.baz === 'Sweet' ? 'Home' : 'Sweet'
      }),
      props: { name: 'bar' },
    },
    {
      name: 'props as function',
      component,
      props: ({ state }) => ({
        name: 'bar',
        bool: true,
        callback() {},
        tag: state.foo.bar,
        number: 14,
      }),
    },
    {
      name: 'plain component',
      component: function Foo() {
        return <div>simple div</div>
      },
    },
    {
      name: 'component without name',
      component: anon,
    },
  ],
}
