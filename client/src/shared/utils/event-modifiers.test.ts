import { describe, expect, it, vi } from 'vitest'

import { stopPropagation } from './event-modifiers'

describe('stopPropagation', () => {
  it('calls stopPropagation on a plain event', () => {
    const stop = vi.fn()

    stopPropagation({ stopPropagation: stop })

    expect(stop).toHaveBeenCalledTimes(1)
  })

  it('calls stopPropagation on wrapped domEvent payload', () => {
    const stop = vi.fn()

    stopPropagation({
      domEvent: {
        stopPropagation: stop
      }
    })

    expect(stop).toHaveBeenCalledTimes(1)
  })
})
