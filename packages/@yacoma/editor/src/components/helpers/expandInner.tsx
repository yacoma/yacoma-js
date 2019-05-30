import * as React from 'react'
import styled from 'styled-components'
import { Page, PageContent, PageHeader } from '@yacoma/styled'
import { ElementTagType } from '../'
import { ElementsType } from '../../lib'
import { ElementSizes } from '../../lib/utils/types'
import { EditorProps } from '../Editor'
import { ElementTag } from '../ElementTag'
import { Footer } from '../Footer'

function groupByPage(
  pageHeight: number,
  inner: ElementsType,
  sizes: ElementSizes
): string[][] {
  const pages: string[][] = []
  let currentPage: string[]
  // Force a new page on first element
  let accumulatedHeight = Infinity
  // Bottom margin of the previous element
  let bottomMargin = 0
  Object.keys(inner)
    .sort((a, b) => inner[a].p - inner[b].p)
    .forEach(key => {
      if (key) {
        // In some legacy compositions, there are blank keys
        // that are cleared on save.

        // If size is not known, use 0. This will be updated
        // on initial render.
        const size = sizes[key]
        const height = size
          ? size.content + Math.max(size.topMargin, bottomMargin)
          : 0
        bottomMargin = size ? size.bottomMargin : 0
        if (accumulatedHeight + height > pageHeight) {
          // start new page
          currentPage = []
          pages.push(currentPage)
          accumulatedHeight = 0
        }
        currentPage.push(key)
        accumulatedHeight += height
      }
    })

  return pages
}

const SmallPage = styled(Page)`
  min-height: auto;
`

export function expandPages(
  ElementTag: ElementTagType,
  editorProps: EditorProps & { children?: any },
  pageSize: number,
  sizes: ElementSizes
): JSX.Element[] {
  const Head = editorProps.header || PageHeader
  const Foot = editorProps.footer || Footer
  const children = editorProps.children

  if (!editorProps.holder.composition) {
    const PageComp = children ? SmallPage : Page
    return [
      <PageComp key={0}>
        <Head page={1} pageCount={1} holder={editorProps.holder} />
        <PageContent className="Content">
          <ElementTag
            editorProps={editorProps}
            holder={editorProps.holder}
            isParagraph
            path={['']}
            key={''}
            elemRef={''}
          />
        </PageContent>
        <Foot page={1} pageCount={1} holder={editorProps.holder} />
      </PageComp>,
    ]
  }
  const inner = editorProps.holder.composition.g
  const pages = groupByPage(pageSize, inner, sizes)
  return pages.map((page, idx) => {
    const PageComp = children && idx === pages.length - 1 ? SmallPage : Page
    return (
      <PageComp key={idx}>
        <Head
          page={idx + 1}
          pageCount={pages.length}
          holder={editorProps.holder}
        />
        <PageContent className="Content">
          {page.map(elemRef => (
            <ElementTag
              editorProps={editorProps}
              // We pass `holder` directly because of tracking that needs
              // to detect state stuff in props and we should not hide it
              // inside another object.
              holder={editorProps.holder}
              isParagraph
              path={[elemRef]}
              key={elemRef}
              elemRef={elemRef}
            />
          ))}
        </PageContent>
        <Foot
          page={idx + 1}
          pageCount={pages.length}
          holder={editorProps.holder}
        />
      </PageComp>
    )
  })
}

let count = 0

export function expandInner(
  editorProps: EditorProps,
  inner: ElementsType,
  path: string[]
): JSX.Element[] {
  count++
  if (count > 100) {
    console.log('expandInner', inner, path)
    throw new Error('WTF ???')
  }
  return Object.keys(inner)
    .sort((a, b) => inner[a].p - inner[b].p)
    .map(elemRef => {
      if (elemRef) {
        return (
          <ElementTag
            editorProps={editorProps}
            holder={editorProps.holder}
            isParagraph={false}
            path={[...path, elemRef]}
            key={elemRef}
            elemRef={elemRef}
          />
        )
      } else {
        // Empty key, will be cleaned up on next save
        return <div />
      }
    })
}
