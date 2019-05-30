import { Context } from '../app'

export function getDraft({ state }: Context, collectionId: string) {
  const draft = state.chat.draft
  if (!draft) {
    state.chat.draft = {
      collectionId,
      title: '',
      attachments: {},
    }
    return state.chat.draft
  } else if (draft.collectionId === collectionId) {
    return draft
  } else {
    console.error(
      `FIXME: Should not work on draft for another collection while a message is in progress.`
    )
    return { collectionId, title: '', attachments: {} }
  }
}
