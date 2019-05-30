import * as allLists from './lists'

export const WORD_COUNT = 12

const lists: { [lang: string]: string[] } = allLists

export function randomWords(
  lang: string,
  count: number = WORD_COUNT
): string[] {
  const list = lists[lang] || lists.en
  const array = new Uint32Array(count)
  crypto.getRandomValues(array)
  const words: string[] = []
  array.map(v => words.push(list[v % list.length]))
  return words
}
