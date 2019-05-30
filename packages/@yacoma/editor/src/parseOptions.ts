import * as React from 'react'
import { EditorOptions } from './lib'
import {
  EditorProvider,
  InternalParagraphOption,
  isCustomParagraphOption,
  isSelectParagraphOption,
  isSimpleParagraphOption,
  ParagraphPayload,
  Paragraphs,
} from './lib/utils/types'

function prepareParagraphs(
  paragraphs: Paragraphs
): { [key: string]: InternalParagraphOption } {
  const results: { [key: string]: InternalParagraphOption } = {}
  Object.keys(paragraphs).forEach(key => {
    const settings = paragraphs[key]
    if (isSelectParagraphOption(settings)) {
      results[key] = {
        op: settings.op,
        toolTag: settings.toolTag,
        payload: JSON.stringify({}),
        showOn: {
          selection: true,
        },
      }
    } else if (isSimpleParagraphOption(settings)) {
      const payload: ParagraphPayload = { o: settings.o }
      results[key] = {
        op: 'P',
        toolTag: settings.toolTag,
        icon: settings.icon,
        payload: JSON.stringify(payload),
        showOn: {
          paragraph: true,
          emptyParagraph: true,
        },
      }
    } else if (isCustomParagraphOption(settings)) {
      const { init } = settings
      const payload: ParagraphPayload = {
        c: key,
      }
      results[key] = {
        op: 'P',
        icon: settings.icon,
        init,
        payload: JSON.stringify(payload),
        preload: settings.preload,
        tag: settings.tag,
        toolTag: settings.toolTag,
        showOn: {
          emptyParagraph: true,
        },
      }
    }
  })
  return results
}

export function parseOptions(editorOpts: EditorOptions): EditorProvider {
  const markup = Object.keys(editorOpts.markup!).map(k => editorOpts.markup![k])
  const paragraphs = prepareParagraphs(editorOpts.paragraphs || {})
  const paragraphList = Object.keys(paragraphs).map(key => paragraphs[key])
  const preload = paragraphList
    .map(para => para.preload)
    .filter(tag => tag !== undefined) as (
    | React.StatelessComponent<{}>
    | React.ComponentClass<{}>)[]

  function getMarkup(text: string) {
    for (const key in markup) {
      const tag = markup[key](text)
      if (tag) {
        return { tag, key }
      }
    }
    return undefined
  }

  function getParagraph(key: string) {
    return paragraphs[key]
  }

  function getMenuChoices(type: 'paragraph' | 'selection' | 'emptyParagraph') {
    return paragraphList.filter(c => c.showOn[type])
  }

  function getPreload() {
    return preload
  }

  return { getMarkup, getParagraph, getMenuChoices, getPreload }
}
