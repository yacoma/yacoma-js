import { timeSkewCheck } from './time'
import { describe, expect, it } from 'test'

describe('timeSkewCheck', () => {
  it('should return an error on date older then 12s', async () => {
    const now = Date.now()

    expect(
      [-130, -120, -3, 0, 3, 60, 70].map(key => ({
        [key]: timeSkewCheck(now, `${key}s`, now + key * 1000),
      }))
    ).toEqual([
      { ['-130']: '-130s: should not be older then 120 seconds' },
      { ['-120']: undefined },
      { ['-3']: undefined },
      { ['0']: undefined },
      { ['3']: undefined },
      { ['60']: undefined },
      { ['70']: '70s: should not be more then 60 seconds in the future' },
    ])
  })
})
