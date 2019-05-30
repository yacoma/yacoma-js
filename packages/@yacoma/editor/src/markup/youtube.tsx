import * as React from 'react'

import { TextMarkup } from '../lib/utils/types'

const YOUTUBE_RE = /^https?:\/\/.*(?:youtu.be|youtube.com)\/(?:embed|watch)\?v=([^#&?]+)$/

function Youtube({ videoId }: { videoId: string }) {
  const src = `//www.youtube.com/embed/${videoId}`
  return (
    <iframe
      width="560"
      height="315"
      src={src}
      frameBorder="0"
      allowFullScreen
    />
  )
}

export const youtube: TextMarkup = text => {
  const match = text.match(YOUTUBE_RE)
  const videoId = match ? match[1] : ''
  if (videoId.length === 11) {
    return <Youtube videoId={videoId} />
  }
  return undefined
}
