import { PageFooter } from '@lucidogen/styled'
import * as React from 'react'
import { Comp, styled } from '../app'

interface FooterProps {
  page: number
  pageCount: number
}

const TheFooter = styled(PageFooter)`
  display: flex;
  flex-direction: column-reverse;
`

const FooterContent = styled.div`
  color: #ccc;
  text-align: right;
`

// Default footer.
export const Footer: Comp<FooterProps> = ({ page, pageCount }) => (
  <TheFooter className="Footer" data-c="Footer">
    <FooterContent>
      {page} / {pageCount}
    </FooterContent>
  </TheFooter>
)
