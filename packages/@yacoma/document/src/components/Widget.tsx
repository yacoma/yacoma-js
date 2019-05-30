import { Icon, InspectorWidget, Table, TableItem } from '@yacoma/styled'
import { styled, theme } from '../app'

export const Widget = styled(InspectorWidget)`
  background: ${theme.explorerBackground};
  height: ${theme.documentWidgetHeight};
`

export const Compose = styled.div`
  border-top: ${theme.cardItemBorder};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

export const WidgetTitle = styled.div`
  display: flex;
  cursor: pointer;
  height: ${theme.documentTitleHeight};
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  background: ${theme.explorerTitleBackground};
  color: ${theme.explorerTitleColor};
  padding: ${theme.titleTextMargin};
  &.access {
    background: ${theme.accessTitleBackground};
  }

  &.submenu {
    background: ${theme.explorerTitleSubBg};
  }
`

export const WidgetTable = styled(Table)`
  border-top: ${theme.cardItemBorder};
`

export const WidgetFlagIcon = styled(Icon)`
  font-size: 0.8rem;
  color: #ccc;
  &.Reader,
  &.Reader.active {
    color: #888;
  }
  &.active {
    color: green;
  }
  &.changed.active {
    color: #ad9d9d;
  }
  &.changed {
    color: #0090008a;
  }
`

export const WidgetItem = styled(TableItem)`
  &.changed {
    background: #f1e3c9;
  }
`
