# @yacoma/crypt

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
![100% coverage](coverage-image)

[npm-image]: https://img.shields.io/npm/v/@yacoma/crypt.svg?style=flat
[npm-url]: https://npmjs.org/package/@yacoma/crypt
[travis-image]: https://img.shields.io/travis/yacoma/yacoma-js.svg?style=flat
[travis-url]: https://travis-ci.org/yacoma/yacoma-js
[coverage-image]: https://user-images.githubusercontent.com/21707/42124583-7f5478c4-7c65-11e8-8d01-36851d49a8ab.png

Fast and storage optimized encryption and signing for both native JS data and
binary content. This is a small layer above the WebCrypto API and ecdDSA from
`tweet-nacl`. Encrypted content is compressed with `pako`.

The library and API are optimized to avoid re-encoding and buffer copy.

Signed and/or encrypted content contain a version number corresponding to
changes to encryption/signature format and or cryptography evolution. Older
versions are kept for decoding older material.

To use crypt on the web, you need to define 'process.env.BROWSER' to `true`
during main app compilation.
