import { Field, Horizontal } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'

export const WORD_IDS: string[][] = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['9', '10', '11'],
]
export interface WordLoginCardProps {}
export interface WordListProps {
  disabled?: boolean
  list: string[]
  reset?: boolean
  resetIcon?: string
  onReset?: (idx: string) => void
  submit?: () => void
}

export const Wrapper = styled.div`
  margin: 1rem 0;
`

export const WordList: Comp<WordListProps> = ({
  disabled,
  list,
  onReset,
  reset,
  resetIcon,
  submit,
}) => {
  const ctx = useOvermind()
  return (
    <Wrapper>
      {WORD_IDS.map((row, ridx) => (
        <Horizontal key={ridx}>
          {row.map(idx => (
            <Field
              disabled={disabled}
              form={list}
              key={idx}
              name={idx}
              submit={submit}
              reset={reset}
              resetIcon={resetIcon}
              onChange={ctx.actions.data.wordChanged}
              onReset={onReset ? () => onReset(idx) : undefined}
            />
          ))}
        </Horizontal>
      ))}
    </Wrapper>
  )
}
