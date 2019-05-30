import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme } from '../app'
import { ScrollDiv } from './ScrollDiv'

export interface TableItemProps {
  className?: string
  // indentation level
  indent?: number
  selected?: boolean
  onClick?: (e: any) => void
  onDoubleClick?: (e: any) => void
}

const ItemComp: Comp<TableItemProps> = ({
  className,
  children,
  indent,
  onClick,
  onDoubleClick,
  selected,
  ...props
}) => (
  <div
    className={classnames(className, {
      selected,
      clickable: onClick || onDoubleClick,
    })}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    style={
      indent !== undefined
        ? {
            paddingLeft: `calc(${indent}*${theme.tableItemIdent})`,
          }
        : {}
    }
    {...props}
  >
    {children}
  </div>
)

export const Table = styled(ScrollDiv)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: auto;
  background: ${theme.tableBackground};
`
Table.displayName = 'Table'

export const TableItem = styled(ItemComp)`
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  flex-grow: 0;
  border-top: ${theme.tableItemBorder};
  &:nth-child(even) {
    background: ${theme.tableItemBackgroundEven};
  }
  &:nth-child(odd) {
    background: ${theme.tableItemBackgroundOdd};
  }
  color: ${theme.tableItemColor};
  &.clickable {
    cursor: pointer;
  }
  &.selected {
    font-weight: bold;
  }
  &:first-child {
    border-top-color: transparent;
  }
`
TableItem.displayName = 'TableItem'

export const TableHeader = styled(TableItem)`
  &:nth-child(odd) {
    color: ${theme.tableHeaderColor};
    background: ${theme.tableHeaderBackground};
  }
  &:nth-child(even) {
    color: ${theme.tableHeaderColor};
    background: ${theme.tableHeaderBackground};
  }
`
TableHeader.displayName = 'TableHeader'

export const TableToolbar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.9rem;
  min-height: 2.16rem;
`
TableToolbar.displayName = 'TableToolbar'

export const TableTool = styled.span`
  display: flex;
  align-self: center;
  flex-grow: 0;
  padding: 3px 5px;
  margin: 5px;
  border-radius: 3px;
  &.selected {
    background: #aaa;
    cursor: normal;
  }
  cursor: pointer;
  color: #555;
`
TableTool.displayName = 'TableTool'
