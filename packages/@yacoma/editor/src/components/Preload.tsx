import * as React from 'react'
import { Comp, useOvermind } from '../app'

export interface PreloadProps {}

/** This component is used for complex editor components that
 * we do not want to load/unload completely but simply
 * hide them.
 */
export const Preload: Comp<PreloadProps> = () => {
  const app = useOvermind()
  const editor = app.state.editor.options()
  const { getPreload } = editor
  return (
    <div>
      {getPreload().map((Tag, idx) => (
        <Tag key={idx} />
      ))}
    </div>
  )
}
