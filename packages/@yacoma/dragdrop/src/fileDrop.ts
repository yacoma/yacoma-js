import { IContext } from 'overmind'
import * as React from 'react'
import { FileDroppableHooks, FileDroppableOptions } from './types'

const UPLOAD_LIMIT = 4 * 1000 * 1000

interface MiniData {
  state: {
    data: {
      uploadLimit?: number
    }
  }
}

export function fileDrop(
  ctx: IContext<MiniData>,
  settings: FileDroppableOptions
): FileDroppableHooks {
  const ref = settings.ref

  // TODO: detect a drag operation in window and add
  // 'dropZone' style.
  // set to noDrop on bad file

  const accept =
    settings.accept ||
    ((file: File) => file.size <= (ctx.state.data.uploadLimit || UPLOAD_LIMIT))

  async function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const data = e.dataTransfer.items
    if (data) {
      const files: File[] = []
      for (let idx = 0; idx < data.length; ++idx) {
        const item = data[idx]
        const file = item.getAsFile()
        if (file && accept(file)) {
          files.push(file)
        }
      }
      if (files.length) {
        settings.onDrop(Object.assign({}, settings.payload || {}, { files }))
      }
    }
    if (ref.current) {
      ref.current.classList.remove('fileDrop')
    }
  }

  function onDragEnter(e: React.DragEvent) {
    // We have no way to test file before drop as this is a security feature to avoid
    // divs passed over on drag operation to eavesdrop on the dragged content.
    if (ref.current) {
      ref.current.classList.add('fileDrop')
    }
    e.stopPropagation()
    e.preventDefault()
  }

  function onDragOver(e: React.DragEvent) {
    // We need this if the hover goes on a child and comes back
    if (ref.current && !ref.current.classList.contains('fileDrop')) {
      ref.current.classList.add('fileDrop')
    }
    e.stopPropagation()
    e.preventDefault()
  }

  function onDragLeave() {
    if (ref.current) {
      ref.current.classList.remove('fileDrop')
    }
  }

  return {
    ref,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
