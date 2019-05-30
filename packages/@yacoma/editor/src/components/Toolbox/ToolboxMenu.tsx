import { Icon } from '@lucidogen/styled'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../../app'
import { ApplyOpArgs, CompositionHolder } from '../../lib'
import { getSelection } from '../helpers/getSelection'

interface ParagraphProps {
  className?: string
  type: 'paragraph' | 'emptyParagraph' | 'selection'
  holder: CompositionHolder
  compId: string
}

const ToolIcon = styled(Icon)`
  margin: 0;
`
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 160px;
  & .item {
    padding: 6px 8px;
    border-radius: 2px;
    cursor: pointer;
  }

  & .item:hover {
    background: #ddd;
  }

  & .item i {
    font-style: normal;
  }

  & .item .heading {
    font-weight: bold;
  }

  & .item .para {
    font-size: 90%;
  }
`

export const ToolboxMenu: Comp<ParagraphProps> = ({
  className,
  type,
  holder,
  compId,
}) => {
  const app = useOvermind()
  const applyOp = app.actions.editor.applyOp
  const options = app.state.editor.options()
  function click(
    e: React.MouseEvent<HTMLDivElement>,
    op: string,
    opts: ApplyOpArgs['opts']
  ) {
    const selection = getSelection(compId)
    if (selection) {
      applyOp({ holder, op, selection, opts })
    }
    e.preventDefault()
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  return (
    <Wrapper className={classnames(className, 'menu')}>
      {options
        .getMenuChoices(type)
        .map(({ op, icon, toolTag, payload }, idx) => (
          <div
            className="item"
            key={idx}
            onClick={e => click(e, op, JSON.parse(payload))}
            onMouseDown={onMouseDown}
          >
            {toolTag || (icon ? <ToolIcon icon={icon} /> : '??')}
          </div>
        ))}
    </Wrapper>
  )
}
