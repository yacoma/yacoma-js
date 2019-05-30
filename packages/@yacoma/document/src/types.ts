import { AccessChanges, Item } from '@lucidogen/data'
import { CompositionType } from '@lucidogen/editor'
import { Operator } from './app'
import { NewDocumentArg } from './args'
import * as effects from './effects'

export interface Document extends Item {
  composition: CompositionType
}

export interface DocumentConfig {
  state: {
    document: {
      // Form to edit user/collection access
      form: {
        // When this is set to true, we display the
        // send button.
        changed?: boolean
        // Search during access edit
        collectionSearch: string
        // In case there is an error during save operation.
        error?: string
        userSearch: string
      } & AccessChanges
    }
  }
  actions: {
    document: {
      new: Operator<NewDocumentArg>
      save: Operator<Item>
      saveWithoutHooks: Operator<Item>
      openParagraph: Operator<{ id: string; paragraphId: string }>
      // Access
      clearForm: Operator
      saveAccessChanges: Operator
      toggleCollectionAccess: Operator<{ collectionId: string }>
      toggleUserAccess: Operator<{ userId: string; access: 'a' | 'e' }>
    }
  }
  effects: {
    document: typeof effects
  }
}
