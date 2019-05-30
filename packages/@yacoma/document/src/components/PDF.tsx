import { FileItem, fileUrl, getItem } from '@lucidogen/data'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Children } from '@lucidogen/styled'

export interface PDFProps {
  className?: string
  width?: number
  itemId: string
  fileId: string
}

const Wrapper = styled.div`
  position: relative;
  & canvas {
    box-shadow: ${theme.pageBoxShadow};
    margin: ${theme.pageOuterMargin};
  }
  & .Loading {
    color: #eee;
    padding: 20px;
  }
`

/* Optimise so that render only occurs on itemId and/or fileId change.
 */
export const PDF: Comp<PDFProps> = React.memo(
  ({ itemId, width, fileId, className }) => {
    const ctx = useOvermind()
    const item = getItem(ctx, itemId) as FileItem
    const ref = useRef<HTMLDivElement>(null)
    const [lastFileId, setFileId] = useState<string>('')
    const url = fileUrl(ctx, item)
    useEffect(() => {
      if (url && ref.current && fileId !== lastFileId) {
        setFileId(fileId)
        ctx.effects.document.showPDF(ref.current, url, { width })
      }
    })

    // We have to use the Loading class so that it is removed on first canvas creation
    if (url) {
      return (
        <Wrapper className={className} ref={ref as any}>
          <Children family="fileOverlay" holder={item} />
          <span className="Loading">
            {ctx.state.locale.translate('LoadingFile')}
          </span>
        </Wrapper>
      )
    } else {
      // This ensures we clear on new item display.
      return (
        <Wrapper className={className}>
          <span className="Loading">
            {ctx.state.locale.translate('LoadingFile')}
          </span>
        </Wrapper>
      )
    }
  }
)
