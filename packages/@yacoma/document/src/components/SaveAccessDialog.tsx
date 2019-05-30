import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  ErrorMessage,
  Horizontal,
  Message,
  Modal,
  RoundInput,
  Spacer,
} from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { CollectionAccessList } from './CollectionAccessList'
import { UserAccessList } from './UserAccessList'

export interface RegisterNameProps {}
export interface RegisterNameCardProps {}

const MyUserAccessList = styled(UserAccessList)`
  height: 5rem;
  width: ${theme.cardWidth};
  margin: 0.5rem;
  border: 1px solid #666;
`

const MyCollectionAccessList = styled(CollectionAccessList)`
  height: 5rem;
  width: ${theme.cardWidth};
  margin: 0.5rem;
  border: 1px solid #c7c7c7;
`

const PaddedHorizontal = styled(Horizontal)`
  padding: 0.5rem;
`

const PaddedRoundInput = styled(RoundInput)`
  padding: 0.5rem;
`

const SaveAccessCard: Comp = () => {
  const app = useOvermind()
  const { collectionAccess } = app.state.document.form
  const hasNewCollections =
    Object.keys(collectionAccess).filter(k => collectionAccess[k] === true)
      .length > 0
  return (
    <Card large shadow>
      <CardTitle titleKey="SaveAccessTitle" />
      <CardContent>
        <Message textKey="SaveAccessMessage" />
        <ErrorMessage errorKey={app.state.document.form.error} />
        <PaddedHorizontal>
          <MyCollectionAccessList onlyChanged />
          <MyUserAccessList onlyChanged />
        </PaddedHorizontal>
        {hasNewCollections && (
          <PaddedHorizontal>
            <PaddedRoundInput
              placeholder
              form={app.state.document.form}
              name="message"
            />
          </PaddedHorizontal>
        )}
      </CardContent>
      <CardFooter>
        <PaddedHorizontal>
          <Spacer />
          <Button onClick={app.actions.dialog.hide} textKey="Cancel" />
          <Button
            primary
            disabled={hasNewCollections && !app.state.document.form.message}
            onClick={app.actions.document.saveAccessChanges}
            textKey="Save"
          />
        </PaddedHorizontal>
      </CardFooter>
    </Card>
  )
}

export const SaveAccessDialog: Comp = () => (
  <Modal>
    <SaveAccessCard />
  </Modal>
)
