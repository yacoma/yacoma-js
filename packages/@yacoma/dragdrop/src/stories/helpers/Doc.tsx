import * as React from 'react'
import { draggable, Drop } from '../..'
import { Comp, useOvermind, styled } from './app'

export const MyDoc = styled.div`
  border: 1px solid #888;
  margin: 3px;
  padding: 5px;
  width: 8rem;
  cursor: pointer;
`

export interface DocProps {
  // payload passed in start drag
  name: string
  group: string
  // custom prop passed with settings on drag
  myprop?: string
}

export const Doc: Comp<DocProps> = ({ group, myprop, name }) => {
  const app = useOvermind()
  const props = draggable(app, {
    drag: 'doc',
    payload: { name, group },
    onClick() {
      alert('normal click')
    },
  })
  return (
    <MyDoc {...props}>
      {myprop || ''}
      {name}
    </MyDoc>
  )
}

export const MyDrop = styled(Drop)`
  padding: 20px;
  margin: 20px;
  background: #eee;
`
