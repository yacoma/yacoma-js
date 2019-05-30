import * as React from 'react'
import { randomWords } from '@yacoma/security'
import {
  Button,
  CardContent,
  CardFooter,
  CardTitle,
  ErrorMessage,
  Horizontal,
  LangSelector,
  Message,
  Modal,
  Spacer,
} from '@yacoma/styled'
import { Comp, useOvermind } from '../app'
import { WordList } from './WordList'
import { WordsCard } from './WordLogin'

export interface RegisterWordsProps {}
export interface RegisterWordsCardProps {}

export const RegisterWordsCard: Comp = () => {
  const app = useOvermind()
  return (
    <WordsCard large shadow>
      <CardTitle titleKey="RegisterTitle" />
      <CardContent>
        <ErrorMessage error={app.state.data.login.error} />
        <Message
          textKey="RegisterWordsMessage"
          replace={{
            '{username}': app.state.data.login.username,
            '{email}': app.state.data.login.email,
          }}
        />
        <WordList
          disabled
          reset
          resetIcon="RefreshWord"
          onReset={idx => {
            app.actions.styled.valueChanged({
              form: app.state.data.login.wordList,
              name: idx,
              value: randomWords(app.state.locale.lang, 1)[0],
            })
          }}
          list={app.state.data.login.wordList}
        />
      </CardContent>
      <CardFooter>
        <Horizontal>
          <Message>
            <LangSelector />
          </Message>
          <Spacer />
          <Button
            onClick={() => app.actions.dialog.show('RegisterName')}
            textKey="Back"
          />
          <Button
            primary
            onClick={app.actions.data.registerWordsContinue}
            textKey="Continue"
          />
        </Horizontal>
      </CardFooter>
    </WordsCard>
  )
}

export const RegisterWords: Comp = () => (
  <Modal>
    <RegisterWordsCard />
  </Modal>
)
