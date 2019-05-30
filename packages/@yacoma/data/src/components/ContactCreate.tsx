import * as React from 'react'
import { randomWords } from '@yacoma/security'
import {
  Button,
  CardContent,
  CardFooter,
  CardTitle,
  ErrorMessage,
  Field,
  Horizontal,
  LangSelector,
  Message,
  Modal,
  Spacer,
} from '@yacoma/styled'
import { Comp, useOvermind } from '../app'
import { WordList } from './WordList'
import { WordsCard } from './WordLogin'

export interface ContactCreateProps {}
export interface ContactCreateCardProps {}

export const ContactCreateCard: Comp = () => {
  const app = useOvermind()
  return (
    <WordsCard large shadow>
      <CardTitle titleKey="ContactCreateTitle" />
      <CardContent>
        <Message textKey="ContactCreateMessage" />
        <ErrorMessage errorKey={app.state.data.login.error} />
        <Field icon placeholder form={app.state.data.login} name="username" />
        <Field icon placeholder form={app.state.data.login} name="email" />
        <Horizontal>
          <Field
            icon
            type="checkbox"
            form={app.state.data.login}
            name="admin"
          />
          <Field
            icon
            type="checkbox"
            form={app.state.data.login}
            name="protected"
          />
          <Spacer />
        </Horizontal>
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
          <Button onClick={app.actions.data.cancelContact} textKey="Cancel" />
          <Button
            primary
            disabled={!app.state.data.login.nameValid}
            onClick={app.actions.data.createContact}
            textKey="Create"
          />
        </Horizontal>
      </CardFooter>
    </WordsCard>
  )
}

export const ContactCreate: Comp = () => (
  <Modal>
    <ContactCreateCard />
  </Modal>
)
