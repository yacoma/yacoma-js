import * as React from 'react'
import { Comp, useOvermind } from '../app'
import { NewIcon } from './NewItemIcon'

export interface UploadIconProps {
  className?: string
  accept?: (file: File) => boolean
}

export const UploadIcon: Comp<UploadIconProps> = ({
  className,
  accept: acceptFilter,
}) => {
  const ctx = useOvermind()
  const ref = React.useRef<HTMLInputElement>(null)

  const collectionId = ctx.state.document.selectedCollectionId

  const accept =
    acceptFilter || ((file: File) => file.size <= ctx.state.data.uploadLimit)

  const handleFiles = (list: FileList | null) => {
    if (!list) {
      return
    }
    const files: File[] = []
    for (let idx = 0; idx < list.length; ++idx) {
      const file = list[idx]
      if (file && accept(file)) {
        files.push(file)
      }
    }
    if (files.length) {
      ctx.actions.data.upload({ open: true, files, collectionId })
    }
  }

  return (
    <NewIcon
      icon="Upload"
      className={className}
      onClick={() => {
        if (ref.current) {
          ref.current.click()
        }
      }}
    >
      <input
        multiple
        type="file"
        style={{ display: 'none' }}
        ref={ref}
        onChange={e => {
          if (e.target.value) {
            // Avoid double upload on Windows.
            handleFiles(e.target.files)
            e.target.value = ''
          }
        }}
      />
    </NewIcon>
  )
}
