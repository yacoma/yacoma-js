import * as React from 'react'
import { Comp, styled, theme } from '../app'

export interface PageProps {
  className?: string
}

interface DivProps {
  className?: string
  children?: React.ReactNode
}

export const Page = styled.div`
  background: #fbfbfb;
  box-shadow: ${theme.pageBoxShadow};
  box-sizing: border-box;
  border-radius: 1px;
  /* We let it grow to avoid blink during pagination. */
  min-height: calc(${theme.pageRatio} * ${theme.pageWidth});
  color: #333;
  .fullscreen & {
    box-shadow: none;
  }
  position: relative;
  width: ${theme.pageWidth};
  break-before: page;
  margin: ${theme.pageOuterMargin};
  @media print {
    @page {
      margin: 0;
      size: A4;
    }
    body,
    & {
      width: 100%;
      margin: 0;
      background: white;
    }
    & {
      box-shadow: none;
    }
  }
`

const Parts = styled.div`
  box-sizing: border-box;
  width: ${theme.pageWidth};
  padding-left: ${theme.pageMarginLeftRight};
  padding-right: ${theme.pageMarginLeftRight};
`

const Header: Comp<DivProps> = ({ className, children }) => (
  <Parts className={className}>{children}</Parts>
)

export const PageHeader = styled(Header)`
  height: ${theme.pageHeaderHeight};
  padding-top: ${theme.pageMarginTopBottom};
  position: absolute;
  top: 0;
`

const Content: Comp<DivProps> = ({ className, children }) => (
  <Parts className={className}>{children}</Parts>
)

export const PageContent = styled(Content)`
  padding-top: ${theme.pageHeaderHeight};
  padding-bottom: ${theme.pageFooterHeight};
`

const Footer: Comp<DivProps> = ({ className, children }) => (
  <Parts className={className}>{children}</Parts>
)

export const PageFooter = styled(Footer)`
  bottom: 0;
  height: ${theme.pageFooterHeight};
  padding-bottom: ${theme.pageMarginTopBottom};
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
`
