import { itemTitle, limitText } from '@yacoma/data'
import { isPairCollectionId, pairCollectionId } from '@yacoma/security'
import { Context, styled, theme } from '../app'

export function contactTitle(ctx: Context, id: string, limit?: number): string {
  const { state } = ctx
  let title = ''
  const uid = state.data.auth.id
  if (isPairCollectionId(id)) {
    const pairId = pairCollectionId(uid, uid)
    if (pairId === id) {
      // Private notes
      title = state.locale.translate('PrivateChat')
    } else {
      title = itemTitle(ctx, { id })
    }
    /*
  } else if (id === workCollectionId(uid)) {
    this 'My' thing is confusing
    title = state.locale.translate('MyChat')
    */
  } else {
    title = itemTitle(ctx, { id })
  }
  if (limit) {
    return limitText(title, limit)
  } else {
    return title
  }
}

export const ContactTitle = styled.span`
  flex-grow: 1;
  overflow: hidden;
  padding: 0 ${theme.iconMargin} 0 0;
  white-space: nowrap;
  cursor: pointer;
`
