import { action, IOperator } from 'overmind'
import * as React from 'react'
import styled from 'styled-components'
import { Stories } from '../..'
import { Comp } from '../../app'
import { createHook } from 'overmind-react'

interface Config {
  state: {
    barName: string
  }
  actions: {
    doSomething: Operator<string>
  }
  effects: {}
}

type Operator<Input = any, Output = Input> = IOperator<Config, Input, Output>

const doSomething: Operator<string> = action(({ state }, value) => {
  state.barName = value
})

const config = {
  state: {
    barName: 'Mona',
  },
  actions: { doSomething },
}
const useOvermind = createHook<typeof config>()

const Box = styled.div`
  border: 1px solid #999;
  padding: 3px;
  cursor: pointer;
  background: orange;
`

const myComponent: Comp<{ className?: string }> = ({ className }) => {
  const app = useOvermind()
  return (
    <Box
      className={className}
      onClick={() => {
        app.actions.doSomething(app.state.barName === 'Lisa' ? 'Mona' : 'Lisa')
      }}
    >
      {app.state.barName}
    </Box>
  )
}

export const sequencesStories: Stories = {
  name: 'actions',
  stories: [
    {
      name: 'simple',
      component: myComponent,
      config,
    },
  ],
}
