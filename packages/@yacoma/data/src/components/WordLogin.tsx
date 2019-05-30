import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  ErrorMessage,
  Horizontal,
  LangSelector,
  Message,
  Modal,
  Spacer,
} from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { WordList } from './WordList'

export const WORD_IDS: string[][] = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['9', '10', '11'],
]
export interface WordLoginCardProps {}
export interface WordLoginProps {}

export const WordsCard = styled(Card)`
  &.large {
    width: 41rem;
  }
`

export const WordLoginCard: Comp = () => {
  const app = useOvermind()
  return (
    <WordsCard large shadow>
      <CardTitle titleKey="LoginTitle" />
      <CardContent>
        <Horizontal>
          <Spacer />
          {/*
                Register is disabled for now.
                <Link
                  onClick={() => app.actions.dialog.show('Register')}
                  textKey="Register"
                />
              */}
        </Horizontal>
        <Message textKey="LoginMessage" />
        <ErrorMessage errorKey={app.state.data.login.error} />
        <WordList
          list={app.state.data.login.wordList}
          submit={app.actions.data.login}
        />
      </CardContent>
      <CardFooter>
        <Horizontal>
          <Message>
            <LangSelector />
          </Message>
          <Spacer />
          <Button primary onClick={app.actions.data.login} text="Login" />
        </Horizontal>
      </CardFooter>
    </WordsCard>
  )
}

export const WordLogin: Comp = () => (
  <Modal>
    <WordLoginCard />
  </Modal>
)
