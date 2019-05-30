import * as React from 'react'
import { Comp, styled, theme } from '../app'

export const Background = styled.div`
  bottom: 0;
  background: ${theme.modalBackground};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  backdrop-filter: ${theme.modalBackdropFilter};
`

const Top = styled.div`
  z-index: 101;
`

export interface ModalProps {
  children?: React.ReactNode
  className?: string
  // Sequence to run on background click (typically to close modal).
  onClick?: () => void
}

// We cannot test with open modal.
// istanbul ignore next
const ModalComp: Comp<ModalProps> = ({ className, children, onClick }) => (
  <div className={className}>
    <Background onClick={onClick} />
    <Top>{children}</Top>
  </div>
)

export const Modal = styled(ModalComp)`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: ${theme.modalTop};
  z-index: 100;
`
