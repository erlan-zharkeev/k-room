import { describe, expect, it } from 'vitest'

import { createHttpError, getHandledErrorMessage, isHandledError, isHttpError } from './create-http-error'

describe('createHttpError', () => {
  it('builds handled http errors and messages', () => {
    const silentError = createHttpError({
      message: 'Request failed',
      status: 400,
      silent: true,
      payload: null
    })
    const visibleError = createHttpError({
      message: 'Request failed',
      status: 400,
      payload: null
    })

    expect(isHttpError(silentError)).toBe(true)
    expect(isHandledError(silentError)).toBe(true)
    expect(getHandledErrorMessage(silentError)).toBe('')
    expect(getHandledErrorMessage(visibleError)).toBe('Request failed')
    expect(getHandledErrorMessage({})).toBe('')
  })
})
