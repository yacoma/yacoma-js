import * as React from 'react'
import { Comp, useOvermind, Context } from '../../app'
import { getAtPath } from '../../lib/utils/getAtPath'
import { CompositionHolder } from '../../lib/utils/types'
import { EditorProps } from '../Editor'
import { expandInner } from '../helpers/expandInner'
import { getElementClassName } from '../helpers/getElementClassName'
import { getElementTag } from '../helpers/getElementTag'
import { setSelection } from '../helpers/setSelection'

export interface GroupTagProps {
  editorProps: EditorProps
  holder: CompositionHolder
  elemRef: string
  key: string
  // Path inside the composition. For root element, this is the
  // same as [elemRef].
  path: string[]
}

interface GroupTagClassProps extends GroupTagProps {
  sizeChange: Context['actions']['editor']['sizeChange']
}

class GroupTagClass extends React.Component<GroupTagClassProps> {
  el: React.RefObject<any>

  constructor(props: GroupTagClassProps) {
    super(props)
    this.el = React.createRef()
  }

  componentDidMount() {
    this.resized()
  }

  componentDidUpdate() {
    this.resized()
  }

  resized() {
    const { el } = this
    if (!el.current) {
      return
    }

    const { sizeChange, elemRef, holder, path } = this.props
    const { composition } = holder
    if (!composition) {
      return
    }
    const savedSize = (composition.sizes || {})[elemRef]
    const elem = getAtPath(composition, path)

    if (path.length > 1) {
      // No selection or resizing for sub elements
      return
    }

    // Set DOM selection
    setSelection(el.current, elem.s)

    const styles = getComputedStyle(el.current)
    const size = {
      content:
        parseInt(styles.height || '0') +
        parseInt(styles.paddingBottom || '0') +
        parseInt(styles.paddingTop || '0'),
      topMargin: parseInt(styles.marginTop || '0'),
      bottomMargin: parseInt(styles.marginBottom || '0'),
    }
    if (size.content && (!savedSize || savedSize.content !== size.content)) {
      sizeChange({ key: elemRef, holder, size })
    }
  }

  render() {
    const { editorProps, path, elemRef, holder } = this.props
    const { composition } = holder
    if (!composition) {
      return null
    }
    const elem = getAtPath(composition, path)
    if (!elem) {
      // Do not know why we need this. parseInner should remove.
      return null
    }
    const Tag = getElementTag(elem)
    const className = getElementClassName(elem)
    return (
      <Tag className={className} data-ref={elemRef} ref={this.el}>
        {expandInner(editorProps, elem.g || {}, path)}
      </Tag>
    )
  }
}

export const GroupTag: Comp<GroupTagProps> = props => {
  const app = useOvermind()
  return <GroupTagClass sizeChange={app.actions.editor.sizeChange} {...props} />
}
