# @yacoma/date

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
![100% coverage](coverage-image)

[npm-image]: https://img.shields.io/npm/v/@yacoma/theme.svg?style=flat
[npm-url]: https://npmjs.org/package/@yacoma/theme
[travis-image]: https://img.shields.io/travis/yacoma/yacoma-js.svg?style=flat
[travis-url]: https://travis-ci.org/yacoma/yacoma-js
[coverage-image]: https://user-images.githubusercontent.com/21707/42124583-7f5478c4-7c65-11e8-8d01-36851d49a8ab.png

A block to use themes in Cerebral apps. The theming values are stored inside the
`theme` state in Cerebral and styling uses CSS variables instead of a react context.

Each block can add/alter values in any given theme. The used theme
overwrites values in the `default` theme. This means that apart from
the `default`, other themes can be partial.
