import * as React from 'react'

import { TextMarkup } from '../lib/utils/types'

const IMAGE_RE = /^(https?:\/\/.*\.(?:jpg|png))$/

function Image({ src }: { src: string }) {
  return <img width="560" height="315" src={src} />
}

export const image: TextMarkup = text => {
  const match = text.match(IMAGE_RE)
  const src = match ? match[1] : undefined
  if (src) {
    return <Image src={src} />
  }
  return undefined
}
