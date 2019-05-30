import classnames from 'classnames'
import { IReactComponent } from 'overmind-react'
import * as React from 'react'
import { Comp, useOvermind } from '../../app'
import { getAtPath } from '../../lib/utils/getAtPath'
import {
  CompositionHolder,
  isCustomElement,
  isDocumentTitle,
  isGroupElement,
  isStringElement,
} from '../../lib/utils/types'
import { EditorProps } from '../Editor'
import { CustomTag } from './CustomTag'
import { GroupTag } from './GroupTag'
import { StringTag } from './StringTag'

export interface ElementTagProps {
  editorProps: EditorProps
  holder: CompositionHolder
  isParagraph?: boolean
  elemRef: string
  // Path to the element inside the composition. For root
  // paragraphs, path === elemRef
  path: string[]
}

export type ElementTagType = IReactComponent<ElementTagProps>

export const ElementTag: Comp<ElementTagProps> = ({
  editorProps,
  elemRef,
  path,
  isParagraph,
}) => {
  // start tracking
  useOvermind()
  const { holder, titlePlaceholder } = editorProps

  if (!holder.composition) {
    const Tag = titlePlaceholder ? 'h1' : 'p'
    return (
      <Tag
        className={classnames({
          Title: titlePlaceholder !== undefined,
          Empty: true,
        })}
        data-ref="base"
        data-placeholder={!holder.title ? titlePlaceholder : undefined}
      >
        {holder.title || '\u200B'}
      </Tag>
    )
  }
  const elem = getAtPath(holder.composition, path)
  if (!elem) {
    // Do not know why we need this. parseInner should remove.
    return null
  }

  if (isCustomElement(elem)) {
    return (
      <CustomTag
        customTagProps={editorProps.customTagProps || {}}
        elemRef={elemRef}
        paraId={path[0]}
        holder={holder}
        key={elemRef}
      />
    )
  } else if (isStringElement(elem)) {
    return (
      <StringTag
        isParagraph={isParagraph}
        elemRef={elemRef}
        path={path}
        holder={holder}
        key={elemRef}
        titlePlaceholder={isDocumentTitle(elem) ? titlePlaceholder : undefined}
      />
    )
  } else if (isGroupElement(elem)) {
    return (
      <GroupTag
        editorProps={editorProps}
        elemRef={elemRef}
        holder={holder}
        path={path}
        key={elemRef}
      />
    )
  } else {
    throw new Error(
      `Invalid element '${elemRef}' in composition '${holder}' (${JSON.stringify(
        elem
      )}).`
    )
  }
}
