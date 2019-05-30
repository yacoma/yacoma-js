import { Editor, HeaderFooterComponentType } from '@lucidogen/editor'
import classnames from 'classnames'
import { isFile, isMessage } from '@lucidogen/data'
import { isCollection } from '@lucidogen/security'
import * as React from 'react'
import { Comp, useOvermind, allThemes, theme } from '../app'
import { Header } from './Header'
import { Image } from './Image'
import { PDF } from './PDF'
import { ShowAttachments } from './ShowAttachments'
import styled from 'styled-components'

interface DocumentEditorProps {
  className?: string
  header?: HeaderFooterComponentType
  footer?: HeaderFooterComponentType
  style?: any
}

const Wrapper = styled.div`
  margin: ${theme.editorMargin};
`

// border: 1px dashed #ccc;
// border-radius: 5px;

export const DocumentEditor: Comp<DocumentEditorProps> = ({
  className,
  header,
  footer,
  style,
  children,
}) => {
  const app = useOvermind()
  const doc = app.state.document.current
  if (!doc) {
    // Loading or no document
    return <React.Fragment>{children}</React.Fragment>
  }

  children = null
  if (isFile(doc)) {
    let Comp: typeof Image | undefined
    if (/image/.test(doc.fileType)) {
      // OK
      Comp = Image
    } else if (/pdf/.test(doc.fileType)) {
      Comp = PDF
    }

    if (Comp) {
      children = (
        <Comp
          itemId={doc.id}
          fileId={doc.fileId}
          width={parseInt(allThemes.pageWidth)}
        />
      )
    }
  } else if (isMessage(doc)) {
    children = <ShowAttachments message={doc} />
  }
  const { translate } = app.state.locale
  const titlePlaceholder = isCollection(doc)
    ? translate('NewCollection')
    : translate('NewDocument')
  return (
    <Wrapper style={style}>
      <Editor
        className={classnames(className, doc.type)}
        holder={doc}
        header={header || (Header as any)}
        footer={footer}
        titlePlaceholder={titlePlaceholder}
      >
        {children}
      </Editor>
    </Wrapper>
  )
}
