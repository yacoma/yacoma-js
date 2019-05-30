import { testStories } from '@yacoma/story'

Date.now = () => 1539949294308
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stories = require('./all')

testStories({}, stories)
