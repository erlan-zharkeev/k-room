import { describe, expect, it } from 'vitest'

import { formatHumanDateTime, normalizeTimestamp } from '../index'

describe('time contracts', () => {
  it('normalizes timestamps predictably', () => {
    expect(normalizeTimestamp('42')).toBe(42)
    expect(normalizeTimestamp('bad')).toBeNull()
  })

  it('formats human date fallback', () => {
    expect(formatHumanDateTime(null, 'en-US', 'Never')).toBe('Never')
  })
})
