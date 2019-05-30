import * as React from 'react'
import { Button, Horizontal, Spacer } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'

export interface SaveAccessChanges {
  className?: string
}

const MyWidget = styled.div`
  display: flex;
  align-items: center;
  height: 2.3rem;
  flex-grow: 1;
  background: ${theme.accessSaveBackground};
  color: ${theme.explorerTitleColor};
  &.hidden {
    display: none;
  }
`

const SmallButton = styled(Button)`
  padding: 0.1rem 0.2rem;
  margin: 0.3rem 1rem 0.3rem 0.5rem;
  font-size: 80%;
  min-width: 5rem;
`

export const SaveAccessChanges: Comp<SaveAccessChanges> = ({ className }) => {
  const app = useOvermind()
  return (
    <MyWidget className={className}>
      <Horizontal>
        <Spacer />
        <SmallButton
          textKey="Cancel"
          onClick={app.actions.document.clearForm}
        />
        <SmallButton
          textKey="Save"
          primary
          onClick={() => app.actions.dialog.show('SaveAccessDialog')}
        />
      </Horizontal>
    </MyWidget>
  )
}
