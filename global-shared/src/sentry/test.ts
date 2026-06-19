import { describe, expect, it } from 'vitest'

import { isIgnoredSentryStatus, shouldIgnoreSentryError } from '../index'

describe('sentry contracts', () => {
  it('ignores expected noise by status and context', () => {
    expect(isIgnoredSentryStatus(404)).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Network Error', silent: false })).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Fatal', silent: true })).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Fatal', silent: false, status: 500 })).toBe(false)
  })
})
