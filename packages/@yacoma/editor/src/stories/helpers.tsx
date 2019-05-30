import { build, settings } from '@lucidogen/build'
import { locale, LocaleSettings } from '@lucidogen/locale'
import { styled as styledBlock } from '@lucidogen/styled'
import { theme, ThemeSettings } from '@lucidogen/theme'
import { action } from 'overmind'
import * as React from 'react'
import { editor, EditorSettings } from '..'
import { Comp, styled, useOvermind } from '../app'
import {
  CompositionType,
  CustomTagProps,
  ElementType,
  newComposition,
} from '../lib'
import { NewCompositionOptions } from '../lib/newComposition'
import { rangeSelection } from '../lib/utils/rangeSelection'

export interface MyParaProps extends CustomTagProps {}

const CustomDiv = styled.div`
  background: #f3f3f3;
  border: 1px solid #cec4b2;
  border-radius: 2px;
  padding: 5px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
`

const CustomSlider = styled.input`
  display: block;
  margin: 10px;
`

export const MyPara: Comp<MyParaProps> = ({ data }) => {
  const app = useOvermind()
  const change = app.actions.editor.dataChange
  return (
    <CustomDiv>
      {JSON.stringify(data)}
      <CustomSlider
        type="range"
        min={0}
        max={1}
        onInput={e => e.stopPropagation()}
        onChange={e => {
          e.preventDefault()
          e.stopPropagation()
          const target = e.target as HTMLInputElement
          change({ data, values: { value: target.value } })
        }}
        step={0.01}
        value={data.value}
      />
    </CustomDiv>
  )
}

function makeComposition2(type: 'selection' | 'emptyParagraph' | 'paragraph') {
  const composition = newComposition({ title: 'Hop' })
  composition.g['para2'] = typeObject(composition.g['para2'], {
    i: 'Some text here.',
    p: 1,
    t: 'P',
    s: rangeSelection(['para2'], 5, ['para2'], 9),
  })
  composition.spath = 'para2'
  composition.toolbox = { type, position: { top: 0, left: 60 } }
  return composition
}

const createComposition = action(
  ({ state, value }: { state: any; value: string }) => {
    state.test[value] = newComposition({ title: true })
  }
)

const test = {
  name: 'test',
  settings: settings<EditorSettings & LocaleSettings & ThemeSettings>({
    editor: {
      paragraphs: {
        X: {
          toolTag: 'X',
          // On paragraph create
          init: () => ({
            value: Math.random(),
          }),
          tag: MyPara,
        },
      },
    },
    locale: {
      en: {
        TypeTextHere: 'Type text here',
        TypeTitleHere: 'Type title here',
      },
    },
    theme: {
      default: {
        pageWidth: '500px',
      },
    },
  }),
  state: {
    test: {
      e1: {
        title: 'Hello Editor',
        composition: makeComposition({ title: 'Hello Editor' })
          .addParagraph('foo', {
            p: 1,
            t: 'P',
            g: {
              one: { p: 0, t: 'T', i: 'One ' },
              two: { p: 1, t: 'B', i: 'more' },
              three: { p: 2, t: 'T', i: ' time.' },
            },
          })
          .addParagraph('bar', { p: 2, t: 'P', c: 'X' })
          .setData('bar', { value: 0.5 })
          .addParagraph('baz', { p: 3, t: 'P', i: '' })
          .done(),
      },
      e2: { composition: newComposition({ title: true }) },
      e3: { composition: newComposition() },
      e4: {
        title: 'Hello Editor',
        composition: newComposition({
          title: 'Hello Editor',
          paragraphs: [
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu metus quis nunc commodo pharetra. Pellentesque accumsan tellus vitae tortor elementum, imperdiet lacinia metus facilisis.`,
            `Aliquam sollicitudin felis at finibus placerat. Cras sed maximus ligula, a mattis sem.`,
            `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean elit nulla, fermentum nec rutrum vitae, placerat ut nibh. Nam ornare at nunc vel porta. Fusce sed porta nibh. Phasellus at leo tortor.`,
            `Morbi in placerat nisl. Aenean non metus malesuada, pulvinar nunc vitae, rhoncus ex. Suspendisse tincidunt posuere cursus. Curabitur laoreet aliquam velit vitae faucibus. Vestibulum pretium euismod tortor. Aenean hendrerit neque nibh, et posuere nisl feugiat vel.`,
            `In hac habitasse platea dictumst. Morbi sagittis neque eget facilisis viverra. Suspendisse elit ex, cursus at odio at, tempor vestibulum lectus.`,
            `Cras diam lorem, sollicitudin ut velit sed, congue semper felis. Donec accumsan elit nec vestibulum sollicitudin. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ex nibh, vestibulum eget lacus id, commodo maximus dui. Duis facilisis, lorem eget euismod finibus, sem erat vestibulum nunc, malesuada porttitor massa mauris non arcu. Nulla dictum justo ac dui venenatis ullamcorper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent nec ante nibh. Duis id maximus nibh. In at sagittis ipsum. Vestibulum urna felis, dapibus sed nulla in, efficitur tristique dolor.`,
          ],
        }),
      },
      e5: { title: 'Just a title' },
      e6: {},
      t1: { composition: makeComposition2('selection') },
      t2: { composition: makeComposition2('paragraph') },
      t3: { composition: makeComposition2('emptyParagraph') },
    },
  },
  actions: {
    test: {
      createComposition,
    },
  },
}

export const config = build(test)
  .using(editor)
  .using(locale)
  .using(styledBlock)
  .using(theme)
  .config()

export type Config = typeof config

// Helper to set a deep path in state while ensuring type is
// correct.
export function setPath<T>(ref: T, elem: Partial<T>): any {
  const tag = ref as any
  const paths: string[] = tag.getPath({}).split('.') // no vars here
  const last = paths.pop()
  if (!last) {
    throw new Error(`Invalid reference path (too short): '${paths.join('.')}'.`)
  }
  const base: any = {}
  const obj = paths.reduce((curr, key) => (curr[key] = {}), base)
  obj[last] = elem
  return base
}

// Helper to ensure path of a given element
export function typeObject<T>(ref: T, elem: Partial<T>): T {
  return elem as T
}

export interface MakeComposition {
  addParagraph(id: string, para: ElementType): MakeComposition
  setData(id: string, data: any): MakeComposition
  done(): CompositionType
}

export function makeComposition(opts: NewCompositionOptions): MakeComposition {
  const comp = newComposition(opts)
  const self: MakeComposition = {
    addParagraph(id, para) {
      comp.g[id] = para
      return self
    },
    setData(id, data) {
      if (!comp.data) {
        comp.data = {}
      }
      comp.data[id] = data
      return self
    },
    done() {
      return comp
    },
  }
  return self
}
