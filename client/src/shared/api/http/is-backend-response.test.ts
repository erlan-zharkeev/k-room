import { describe, expect, it } from 'vitest'

import { isBackendResponse } from './is-backend-response'

describe('isBackendResponse', () => {
  it('detects backend response payloads', () => {
    expect(isBackendResponse({ message: { text: 'Failed', silent: false }, payload: null })).toBe(true)
    expect(isBackendResponse({ message: { text: 'Failed', silent: 'false' } })).toBe(false)
  })
})
