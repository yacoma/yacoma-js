import * as React from 'react'
import { Comp, Context, styled, useOvermind } from '../../app'
import {
  CaretSelectionType,
  CompositionHolder,
  CustomElementType,
  CustomTagProps,
} from '../../lib/utils/types'
import { Spacer } from '../Spacer'
import { DragBar } from './DragBar'

export type ElementTagType = Comp<CustomTagProps>

const Wrap = styled.div`
  position: relative;
`

interface CustomTagWrapperProps {
  // Extra tag props passed from Editor.
  customTagProps: any
  // The paragraph id.
  elemRef: string
  // Path to the element inside the composition (same as elemRef for
  // root elements).
  paraId: string
  // The path to the composition.
  holder: CompositionHolder
}

interface CustomTagClassProps extends CustomTagWrapperProps {
  selectChange: Context['actions']['editor']['selectChange']
  sizeChange: Context['actions']['editor']['sizeChange']
  options: Context['state']['editor']['options']
}

// FIXME: refactor using useState and useEffects
class CustomTagClass extends React.Component<CustomTagClassProps> {
  el: React.RefObject<HTMLDivElement>

  constructor(props: CustomTagClassProps) {
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
    const { el, props } = this
    if (!el.current) {
      return
    }

    const { sizeChange, elemRef, holder } = props
    const { composition } = holder

    const savedSize = (composition!.sizes || {})[elemRef]

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
      selectChange,
      elemRef,
      holder,
      customTagProps,
      paraId,
    } = this.props
    const elem = holder.composition!.g[elemRef]
    const options = opt()

    if (!elem) {
      return null
    }

    const customDef = elem.c ? options.getParagraph(elem.c) : undefined
    if (!customDef || !customDef.tag) {
      console.error(`Invalid custom tag '${elem.c}': cannot render this.`)
      return <p className="error" />
    } else {
      const Tag = customDef.tag
      const icon = customDef.icon

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function click(e: React.MouseEvent<HTMLDivElement>) {
        // select...
        const selection: CaretSelectionType = {
          anchorPath: [elemRef],
          anchorOffset: 0,
          type: 'Caret',
          position: { top: 0, left: 0 },
        }
        selectChange({ holder, selection })
      }

      const selected = (elem.s && true) || false
      // FIXME: we have to deal with attachment in another way. Something like:
      // const attach = dragProvider.attach(customTagProps, customDef, elemRef)
      // const attach: DragAttachment =
      const attach = {
        icon,
        id: this.props.customTagProps.id,
        para: elemRef,
      }
      const data = (holder.composition!.data || {})[paraId]
      if (!data) {
        throw new Error(
          `Invalid custom paragraph '${paraId}': missing data field.`
        )
      }

      return (
        <Wrap
          contentEditable={false}
          data-ref={elemRef}
          data-c={elem.c}
          onClick={click}
          // FIXME: This should not be needed. Maybe there is a fix in a newer version
          // of styled components.
          ref={this.el as any}
        >
          <DragBar
            attach={attach}
            attachKey={elemRef}
            doubleClick={
              () => alert('FIXME: openParagraph')
              // dragProvider.open ?
              // openParagraph({ id: this.props.docId, para: elemRef, path })
            }
            className={selected ? 'selected' : ''}
            types={{ paragraph: true }}
          />
          <Tag
            customTagProps={customTagProps}
            paraId={paraId}
            data={data}
            paragraph={elem as CustomElementType}
          />
          {paraId.length === 1 ? (
            <Spacer
              key={elemRef + 'Spacer'}
              holder={holder}
              prevRef={elemRef}
            />
          ) : null}
        </Wrap>
      )
    }
  }
}

export const CustomTag: Comp<CustomTagWrapperProps> = props => {
  const app = useOvermind()
  return (
    <CustomTagClass
      selectChange={app.actions.editor.selectChange}
      sizeChange={app.actions.editor.sizeChange}
      options={app.state.editor.options}
      {...props}
    />
  )
}
