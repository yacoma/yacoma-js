import { makeId } from '@lucidogen/crypt'
import { IReactComponent } from 'overmind-react'
import * as React from 'react'
import { theme, useOvermind, Comp, styled, Context } from '../app'
import { CompositionHolder, SelectionType } from '../lib/utils/types'
import { ElementTag } from './ElementTag'
import { expandPages } from './helpers/expandInner'
import { getCommand } from './helpers/getCommand'
import { getSelection } from './helpers/getSelection'
import { Toolbox } from './Toolbox'

export type HeaderFooterComponentType = IReactComponent<{
  holder: CompositionHolder
  page: number
  pageCount: number
}>

export interface EditorProps {
  className?: string
  customTagProps?: any
  header?: HeaderFooterComponentType
  footer?: HeaderFooterComponentType
  holder: CompositionHolder
  // When there is no title, what should
  // we display as placeholder
  titlePlaceholder?: string
  children?: any
}

interface EditorClassProps extends EditorProps {
  selectChange: Context['actions']['editor']['selectChange']
  backspacePress: Context['actions']['editor']['backspacePress']
  enterPress: Context['actions']['editor']['enterPress']
  inputChange: Context['actions']['editor']['inputChange']
  theme: Context['state']['theme']['selectedTheme']
}

function getValue(anchorNode: Node) {
  const parent = anchorNode.parentNode as HTMLElement
  const text = anchorNode.textContent || ''
  const pos = text.indexOf('\u200B')
  if (pos && parent && parent.classList.contains('Empty')) {
    return text.slice(0, pos)
  } else {
    return text.replace(/ +$/g, ' ') // replace utf8 no-backspace sttring with normal char
  }
}

// This is used to set relative position of Editor content so that
// selections can be measured.
const EditorWrapper = styled.div`
  width: ${theme.pageWidth};
`

const EditorPositioner = styled.div`
  position: relative;
`

class EditorClass extends React.Component<EditorClassProps> {
  deletedSelection: SelectionType | undefined
  // sttringified version of selection
  lastSelection: string
  // editor id used to track paths (random value)
  id: string

  constructor(props: EditorClassProps) {
    super(props)

    this.deletedSelection = undefined
    this.lastSelection = ''
    this.id = makeId(6)
  }

  onSelect(e: React.SyntheticEvent<HTMLDivElement>) {
    // When comming back to the editor window, this triggers AFTER the first key stroke
    // which is bad if the keystroke changes the selection as this sends the previous
    // selection. Check if selection is the same as last to avoid this.
    const { selectChange, holder } = this.props

    const selection = getSelection(this.id)
    if (!selection) {
      this.lastSelection = ''
      return
    }
    const strSelection = JSON.stringify(selection)
    if (strSelection === this.lastSelection) {
      // noop
    } else {
      this.lastSelection = strSelection
      selectChange({ holder, selection })
    }
  }

  onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    /*
        e.preventDefault ()
        const text = e.clipboardData.getData ( 'sarigama/composition' )
        if ( text ) {
          pasteDocument ( { id, text } )
        }
        */
  }

  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const { enterPress, backspacePress, holder } = this.props

    const selection = getSelection(this.id)
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        this.deletedSelection = undefined
        if (!selection) {
          return
        }
        enterPress({ holder, selection })
        return
      case 'Backspace':
        e.preventDefault()
        this.deletedSelection = undefined
        if (!selection) {
          return
        }
        backspacePress({ holder, selection })
        return
      default:
      // do nothing
    }

    const command = getCommand(e)
    if (selection && command) {
      // handle copy/paste/bold, etc
      // console.log(command)
    } else if (selection && selection.type === 'Range') {
      this.deletedSelection = selection
      // backspacePress({selection})
      // then continue with edit ?
    }
  }

  onInput(e: React.FormEvent<HTMLDivElement>) {
    const { backspacePress, inputChange, holder } = this.props

    const selection = getSelection(this.id)
    if (!selection) {
      return
    }
    const { anchorNode } = window.getSelection()
    const value = getValue(anchorNode)
    if (this.deletedSelection) {
      backspacePress({ holder, selection: this.deletedSelection })
      this.deletedSelection = undefined
    }
    inputChange({ holder, selection, value })
  }

  render() {
    const { theme, className, holder } = this.props
    const { composition } = holder
    const sizes = composition ? composition.sizes : {}
    const pageSize =
      parseFloat(theme.pageRatio) * parseFloat(theme.pageWidth) -
      parseFloat(theme.pageHeaderHeight) -
      parseFloat(theme.pageFooterHeight)
    return (
      <EditorWrapper>
        <EditorPositioner>
          <div
            className={className}
            id={this.id}
            data-compid={this.id}
            contentEditable
            onInput={e => this.onInput(e)}
            onKeyDown={e => this.onKeyDown(e)}
            onPaste={e => this.onPaste(e)}
            onSelect={e => this.onSelect(e)}
            suppressContentEditableWarning
          >
            {expandPages(ElementTag, this.props, pageSize, sizes || {})}
          </div>
          {this.props.children}
          <Toolbox holder={holder} compId={this.id} />
        </EditorPositioner>
      </EditorWrapper>
    )
  }
}

const Ed: Comp<EditorProps> = props => {
  const app = useOvermind()
  return (
    <EditorClass
      selectChange={app.actions.editor.selectChange}
      backspacePress={app.actions.editor.backspacePress}
      enterPress={app.actions.editor.enterPress}
      inputChange={app.actions.editor.inputChange}
      theme={app.state.theme.selectedTheme}
      {...props}
    />
  )
}

export const Editor = styled(Ed)`
  /** Do not use padding or margin inside .Composition or selection calculations
 are wrong. */
  margin: 0;
  padding: 0;

  & *:focus,
  &:focus {
    outline: none;
  }

  & .em {
    font-style: italic;
  }

  & .strong {
    font-weight: bold;
  }

  & p,
  & h1,
  & h2,
  & h3 {
    line-height: ${theme.editorParagraphsLineHeight};
    margin: ${theme.editorParagraphsMargin};
  }

  & h1 {
    font-weight: ${theme.editorH1Weight};
    font-size: ${theme.editorH1FontSize};
    line-height: ${theme.editorH1FontSize};
    margin: ${theme.editorH1Margin};
  }

  & h2 {
    font-weight: ${theme.editorH2Weight};
    font-size: ${theme.editorH2FontSize};
    line-height: ${theme.editorH2FontSize};
    margin: ${theme.editorH2Margin};
  }

  & h3 {
    font-weight: ${theme.editorH3Weight};
    font-size: ${theme.editorH3FontSize};
    line-height: ${theme.editorH3FontSize};
    margin: ${theme.editorH3Margin};
  }

  & h3 .em,
  & h2 .em,
  & h1 .em {
    font-style: inherit;
    border-bottom: ${theme.editorHeaderEmBorderBottom};
  }

  & h1.Title {
    font-size: ${theme.editorTitleFontSize};
    line-height: ${theme.editorTitleFontSize};
    color: ${theme.editorTitleColor};
    padding: ${theme.editorTitlePadding};
    border-bottom: ${theme.editorTitleBorderBottom};
  }

  & p {
    text-align: ${theme.editorPTextAlign};
  }

  & .Empty {
    position: relative;
  }

  & p.Empty {
    border-left: ${theme.editorEmptyBorderLeft};
  }

  /* Bottom margin not counted to build pages.
 * Top margin IS USED.
 */
  & p:last-child,
  & h1:last-child,
  & h2:last-child,
  & h3:last-child {
    margin-bottom: 0;
  }

  @media print {
    & .Empty {
      opacity: 0;
    }
  }

  & .Empty:before {
    content: ${theme.editorEmptyBefore};
    opacity: ${theme.editorEmptyBeforeOpacity};
    position: absolute;
  }
`
