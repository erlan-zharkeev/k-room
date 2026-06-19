import { describe, expect, it } from 'vitest'

import { getHeaderValue } from './get-header-value'

describe('getHeaderValue', () => {
  it('normalizes header values', () => {
    expect(getHeaderValue(['a', 'b'])).toBe('a, b')
    expect(getHeaderValue('single')).toBe('single')
    expect(getHeaderValue(123)).toBe('')
  })
})
