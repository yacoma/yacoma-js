import { getNeighbours } from './getNeighbours'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('getNeighbours', () => {
  it('finds neighbours at root level', () => {
    const path = ['para2']
    expect(
      getNeighbours(composition, path).map(e => (e ? e.path : null))
    ).toEqual([['para1', 'span15'], ['para3']])
  })

  it('finds next neighbour across levels', () => {
    const path = ['para1', 'span12', 'span122']
    expect(
      getNeighbours(composition, path).map(e => (e ? e.path : null))
    ).toEqual([['para1', 'span12', 'span121'], ['para1', 'span13']])
  })

  it('finds prev neighbour across levels', () => {
    const path = ['para1', 'span12', 'span121']
    expect(
      getNeighbours(composition, path).map(e => (e ? e.path : null))
    ).toEqual([['para1', 'span11'], ['para1', 'span12', 'span122']])
  })

  it('finds prev neighbour up across levels', () => {
    const path = ['para3']
    expect(
      getNeighbours(composition, path).map(e => (e ? e.path : null))
    ).toEqual([['para2', 'span23'], null])
  })
})
