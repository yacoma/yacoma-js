import * as React from 'react'
import { limitText } from '@yacoma/data'
import { isCollectionId } from '@yacoma/security'
import { Icon } from '@yacoma/styled'
import { Comp, styled, theme, useOvermind } from '../app'
import { ItemIcon } from './ItemIcon'

export interface DocumentLinkProps {
  className?: string
  onRemove?: () => void
  // Context
  collectionId?: string
  // What to link to
  // icon?: string
  id?: string
  // paragraphId?: string
  style?: { left: number; top: number }
  limit?: number
  // title?: string
  // url?: string
}

const RemoveIcon = styled(Icon)`
  font-size: ${theme.doclinkRemoveIconFontSize};
  color: ${theme.doclinkRemoveIconColor};
  &:hover {
    color: ${theme.doclinkRemoveIconHoverColor};
  }
`

const Detail = styled.span`
  margin: ${theme.doclinkDetailMargin};
  color: ${theme.doclinkDetailColor};
  font-size: ${theme.doclinkDetailFontSize};
`

export const Wrapper = styled.div`
  cursor: pointer;
  color: #4455aa;
  &.Unknown {
    color: #666;
  }
`

export const DocumentLink: Comp<DocumentLinkProps> = ({
  className,
  // icon,
  id,
  // paragraphId,
  style,
  // title,
  onRemove,
  collectionId,
  // url,
  limit,
}) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const doc = id ? data.getItem(ctx, id) : undefined
  const selectItem = ctx.actions.data.select
  const selectView = ctx.actions.data.selectCollection

  // const openParagraph = app.actions.document.openParagraph
  const translate = ctx.state.locale.translate
  /*
      if (url) {
        return (
          <a className={className} href={url} target="_blank" style={style}>
            {onRemove ? <RemoveIcon icon="Remove" onClick={onRemove} /> : null}
            <Icon large={largeIcon} icon="ExternalLink" />
            {title || url}
          </a>
        )
      } else 
      */
  if (id && collectionId) {
    // LINK TO DOCUMENT OR PARAGRAPH

    let detail: string | undefined
    let linkText: string
    let onClick: ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined
    let detailClick: ((e: any) => void) | undefined
    /*
        if (paragraphId) {
          detail = !doc ? translate('UnknownDocument') : doc.title
          linkText = title || '???'
          if (doc) {
            onClick = () => openParagraph({ id, paragraphId })
            detailClick = e => {
              e.stopPropagation()
              openDocument({ id, collectionId })
            }
          }
        } else 
        */
    if (doc) {
      linkText = data.itemTitle(ctx, doc)
      if (limit) {
        linkText = limitText(linkText, limit)
      }
      if (isCollectionId(doc.id)) {
        onClick = e => {
          e.stopPropagation()
          selectView(collectionId)
        }
      } else {
        onClick = e => {
          e.stopPropagation()
          selectItem({ id: id!, collectionId })
        }
      }
    } else {
      linkText = '???'
      detail = translate('UnknownDocument')
    }
    return (
      <Wrapper
        className={className + (doc ? '' : ' Unknown')}
        onClick={onClick}
        style={style}
      >
        {onRemove ? <RemoveIcon icon="Remove" onClick={onRemove} /> : null}
        {doc ? <ItemIcon item={doc} /> : '??'}
        {linkText}
        {detail ? <Detail onClick={detailClick}>{detail}</Detail> : null}
      </Wrapper>
    )
  } else {
    // Should not happen
    console.log(`Invalid link`)
    return null
  }
}
