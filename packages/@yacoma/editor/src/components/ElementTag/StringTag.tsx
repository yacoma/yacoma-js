import * as React from 'react'
import { Context, Comp, useOvermind } from '../../app'
import { getAtPath } from '../../lib/utils/getAtPath'
import { CompositionHolder } from '../../lib/utils/types'
import { getElementClassName } from '../helpers/getElementClassName'
import { getElementTag } from '../helpers/getElementTag'
import { setSelection } from '../helpers/setSelection'
import { Spacer } from '../Spacer'

interface StringTagProps {
  isParagraph?: boolean
  elemRef: string
  key: string
  // Path inside composition. Length === 1 for root elements
  path: string[]
  holder: CompositionHolder
  titlePlaceholder?: string
}

interface StringTagClassProps extends StringTagProps {
  sizeChange: Context['actions']['editor']['sizeChange']
  options: Context['state']['editor']['options']
}

function noBackspace(text: string) {
  return text.replace(/ +$/g, ' ') // utf8 no-backspace sttring
}

export type ElementTagType = React.ComponentClass<StringTagProps>

class StringTagClass extends React.Component<StringTagClassProps> {
  el: React.RefObject<any>

  constructor(props: StringTagClassProps) {
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

    setSelection(el.current, elem.s)

    if (path.length !== 1) {
      // Not a root paragraph:
      // do not record size for inner elements of groups: Parent triggers the resize.
      return
    }

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
    const {
      options: opt,
      elemRef,
      path,
      isParagraph,
      holder,
      titlePlaceholder,
    } = this.props
    const options = opt()
    const elem = getAtPath(holder.composition!, path)
    if (!elem) {
      // Do not know why we need this. parseInner should remove.
      return null
    }

    const Tag = getElementTag(elem, isParagraph)
    const className = getElementClassName(elem)

    const text = elem.i || ''

    if (path.length === 1) {
      // This means that `path === [elemRef]`
      // Only test markup for root elements.
      const markup = options.getMarkup(text)
      if (markup) {
        return (
          <div>
            <p
              className={`${markup.key}`}
              contentEditable={false}
              data-ref={elemRef}
              ref={this.el}
            >
              {markup.tag}
            </p>
            <Spacer
              key={elemRef + 'Spacer'}
              holder={holder}
              prevRef={elemRef}
            />
          </div>
        )
      }
    }
    return path.length === 1 && text === '' ? (
      // Empty paragraph
      <Tag
        className={className}
        data-ref={elemRef}
        data-placeholder={titlePlaceholder}
        ref={this.el}
      >
        {'\u200B'}
      </Tag>
    ) : (
      <Tag className={className} data-ref={elemRef} ref={this.el}>
        {noBackspace(text)
        /* If 'str' ends with a space, it will not display. Bug #92 */
        }
      </Tag>
    )
  }
}

export const StringTag: Comp<StringTagProps> = props => {
  const app = useOvermind()
  return (
    <StringTagClass
      sizeChange={app.actions.editor.sizeChange}
      options={app.state.editor.options}
      {...props}
    />
  )
}
