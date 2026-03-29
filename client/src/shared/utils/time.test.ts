import { afterEach, describe, expect, it, vi } from 'vitest'

import { getNextReqInterval } from './time'

describe('getNextReqInterval', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns remaining seconds until next request time', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000)

    expect(getNextReqInterval(6_000)).toBe(5)
  })

  it('returns negative seconds when timestamp is already expired', () => {
    vi.spyOn(Date, 'now').mockReturnValue(10_000)

    expect(getNextReqInterval(8_000)).toBe(-2)
  })
})
