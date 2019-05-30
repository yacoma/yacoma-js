import { AttachmentType } from '@yacoma/data'
import * as actions from './actions'
import * as effects from './effects'

export interface SelectedChat {
  // Selected collection id
  id: string
  // Force opening chat (do not toggle)
  force?: boolean
  // preview message
  preview?: boolean
}

export interface ChatState {
  draft?: {
    collectionId: string
    previewId?: string
    title: string
    attachments: {
      [attachIdx: string]: AttachmentType
    }
  }
}

export interface ChatConfig {
  state: {
    chat: ChatState
  }
  actions: {
    chat: typeof actions
  }
  effects: {
    chat: typeof effects
  }
}
