import * as React from 'react'

import { SelectParagraphOption } from '../lib/utils/types'

export const B: SelectParagraphOption = {
  op: 'B',
  toolTag: <i className="strong">B</i>,
  showOn: { selection: true },
}

export const I: SelectParagraphOption = {
  op: 'I',
  toolTag: <i className="em">I</i>,
  showOn: { selection: true },
}

export const A: SelectParagraphOption = {
  op: 'A',
  toolTag: <i className="em">link</i>,
  showOn: { selection: true },
}
