import { Comp, styled, useOvermind } from '../app'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { FileItem, fileUrl, getItem } from '@lucidogen/data'

export interface ImageProps {
  className?: string
  width?: number
  itemId: string
  fileId: string
}

const Wrapper = styled.div`
  & img {
    border: 1px solid #222;
    width: 100%;
  }
  & span {
    color: #eee;
    padding: 20px;
  }
`

export const Image: Comp<ImageProps> = React.memo(
  ({ className, itemId, fileId }) => {
    const ctx = useOvermind()
    const item = getItem(ctx, itemId) as FileItem

    const ref = useRef<HTMLDivElement>(null)
    const [lastFileId, setFileId] = useState<string>('')

    const url = fileUrl(ctx, item)

    useEffect(() => {
      const div = ref.current
      if (url && div && fileId !== lastFileId) {
        setFileId(fileId)
        const img = div.querySelector('img')
        if (img) {
          img.src = url
          img.style.display = 'block'
        }
        const span = div.querySelector('span')
        if (span) {
          span.style.display = 'none'
        }
      }
    })

    if (url) {
      return (
        <Wrapper className={className} ref={ref as any}>
          <img style={{ display: 'none' }} />
        </Wrapper>
      )
    } else {
      // This ensures we clear on new item display.
      return (
        <Wrapper className={className}>
          <span>{ctx.state.locale.translate('LoadingFile')}</span>
        </Wrapper>
      )
    }
  }
)
