import * as React from 'react'

import { Table as component, TableItem } from '../..'
import { config, Stories } from '../helpers'

export const tableStories: Stories<{}> = {
  component,
  config,
  name: 'Table with items',
  stories: [
    {
      name: 'simple',
      props: {},
      children: [
        <TableItem key="1">foo</TableItem>,
        <TableItem key="2" indent={1}>
          bar
        </TableItem>,
        <TableItem key="3" indent={2}>
          baz
        </TableItem>,
      ],
    },
  ],
}
