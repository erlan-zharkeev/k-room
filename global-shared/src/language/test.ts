import { describe, expect, it } from 'vitest'

import { formatPlural } from '../index'

describe('language contracts', () => {
  it('formats plural values through shared helpers', () => {
    expect(formatPlural('en', 1, { one: 'item', other: 'items' })).toBe('1 item')
    expect(formatPlural('en', 2, { one: 'item', other: 'items' })).toBe('2 items')
  })
})
