import * as React from 'react'

import { TextMarkup } from '../lib/utils/types'

const VIMEO_RE = /^https?:\/\/.*(?:vimeo.com)\/(\d+)$/

/*
<iframe src="https://player.vimeo.com/video/332447363?color=ffffff&byline=0&portrait=0&badge=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/332447363">Tide</a> from <a href="https://vimeo.com/panoply">Panoply</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
*/
function Vimeo({ videoId }: { videoId: string }) {
  const src = `//player.vimeo.com/video/${videoId}`
  return (
    <iframe
      width="640"
      height="360"
      src={src}
      frameBorder="0"
      allowFullScreen
    />
  )
}

export const vimeo: TextMarkup = text => {
  const match = text.match(VIMEO_RE)
  if (match) {
    return <Vimeo videoId={match[1]} />
  }
  return undefined
}
