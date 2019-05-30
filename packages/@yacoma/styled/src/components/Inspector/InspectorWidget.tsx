import { styled, theme } from '../../app'

export const InspectorWidget = styled.div`
  display: flex;
  flex-direction: column;
  width: ${theme.cardWidth};
  &.hidden {
    display: none;
  }
  div:not(.hidden) + &:not(.hidden) {
    border-left: ${theme.inspectorWidgetBorderLeft};
  }
  background: ${theme.inspectorWidgetBackground};
`
