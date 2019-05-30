// istanbul ignore if
if (process.env.BROWSER) {
  // Browser
  require('buffer')
} else {
  // Node.js
  const WebCrypto = require('node-webcrypto-ossl')
  const encoding = require('text-encoder')
  // @ts-ignore
  global.TextEncoder = encoding.TextEncoder
  // @ts-ignore
  global.TextDecoder = encoding.TextDecoder
  // @ts-ignore
  global.crypto = new WebCrypto()
}
