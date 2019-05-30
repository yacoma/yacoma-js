import {
  Button,
  Card,
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
} from '@lucidogen/styled'
import * as React from 'react'
import { Comp, useOvermind } from '../app'

export interface RegisterNameProps {}
export interface RegisterNameCardProps {}

export const RegisterNameCard: Comp = () => {
  const app = useOvermind()
  return (
    <Card large shadow>
      <CardTitle titleKey="RegisterTitle" />
      <CardContent>
        <Message textKey="RegisterNameMessage" />
        <ErrorMessage errorKey={app.state.data.login.error} />
        <Field
          icon
          placeholder
          form={app.state.data.login}
          name="username"
          submit={app.actions.data.registerNameContinue}
        />
        <Field
          icon
          placeholder
          form={app.state.data.login}
          name="email"
          submit={app.actions.data.registerNameContinue}
        />
      </CardContent>
      <CardFooter>
        <Horizontal>
          <Message>
            <LangSelector />
          </Message>
          <Spacer />
          <Button onClick={app.actions.data.registerCancel} textKey="Cancel" />
          <Button
            primary
            disabled={!app.state.data.login.nameValid}
            onClick={app.actions.data.registerNameContinue}
            textKey="Continue"
          />
        </Horizontal>
      </CardFooter>
    </Card>
  )
}

export const RegisterName: Comp = () => (
  <Modal>
    <RegisterNameCard />
  </Modal>
)
