import {
  Button,
  ErrorMessage,
  Horizontal,
  Icon,
  LangSelector,
  Message,
  Page,
  PageContent,
  PageHeader,
  Spacer,
  Text,
} from '@lucidogen/styled'
import * as React from 'react'
import { useEffect } from 'react'
import { Comp, styled, useOvermind } from '../app'
import { WordList } from './WordList'

export interface ContactPrintProps {}

const HorizontalNoPrint = styled(Horizontal)`
  @media print {
    display: none;
  }
`

const Center = styled.div`
  display: table;
  margin: auto;
  width: 80%;
`

export const ContactPrint: Comp = () => {
  const app = useOvermind()
  useEffect(() => {
    const originalName = document.title
    document.title = form.username
    return () => {
      document.title = originalName
    }
  })
  const { translate } = app.state.locale
  const form = app.state.data.login

  return (
    <Page>
      <PageHeader />
      <PageContent>
        <HorizontalNoPrint>
          <Message>
            <LangSelector />
          </Message>
          <Spacer />
          <Button onClick={app.actions.data.cancelContact} textKey="Close" />
          <Button primary onClick={() => window.print()} textKey="Print" />
        </HorizontalNoPrint>
        <h1>
          <Text
            textKey="ContactPrintTitle"
            replace={{ ['{username}']: form.username }}
          />
        </h1>
        <Text
          textKey="ContactPrintMessage"
          replace={{ ['{username}']: form.username }}
        />
        <ErrorMessage errorKey={form.error} />
        <p>
          <b>{translate('username')}</b>: {form.username}
        </p>
        <p>
          <b>{translate('email')}</b>: {form.email}
        </p>
        <Horizontal>
          {form.admin && <Icon icon="admin" />}
          {form.protected && <Icon icon="protected" />}
        </Horizontal>
        <h2>{translate('wordList')}</h2>
        <Center>
          <WordList disabled list={app.state.data.login.wordList} />
        </Center>
      </PageContent>
    </Page>
  )
}
