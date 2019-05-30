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

export interface RegisterVerifyCardProps {}
export interface RegisterVerifyProps {}

export const WordsCard = styled(Card)`
  &.large {
    width: 41rem;
  }
`

export const RegisterVerifyCard: Comp = () => {
  const app = useOvermind()
  return (
    <WordsCard large shadow>
      <CardTitle titleKey="Register" />
      <CardContent>
        <Message
          textKey="RegisterVerifyMessage"
          replace={{
            ['{username}']: app.state.data.login.username,
            ['{email}']: app.state.data.login.email,
          }}
        />
        <ErrorMessage error={app.state.data.login.error} />
        <WordList
          list={app.state.data.login.wordListVerify}
          submit={app.actions.data.register}
        />
      </CardContent>
      <CardFooter>
        <Horizontal>
          <Message>
            <LangSelector />
          </Message>
          <Spacer />
          <Button
            onClick={() => app.actions.dialog.show('RegisterWords')}
            text="Back"
          />
          <Button
            primary
            disabled={!app.state.data.login.valid}
            onClick={app.actions.data.register}
            text="Register"
          />
        </Horizontal>
      </CardFooter>
    </WordsCard>
  )
}

export const RegisterVerify: Comp = () => (
  <Modal>
    <RegisterVerifyCard />
  </Modal>
)
