import { describe, expect, it } from 'vitest'

import {
  createHttpError,
  getHandledErrorMessage,
  isExpectedHttpError,
  isHandledError,
  isHttpError
} from './create-http-error'

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

  it('detects expected http errors for local UI handling', () => {
    const businessError = createHttpError({ message: 'Nickname exists', status: 400 })
    const networkError = createHttpError({ message: 'Network Error' })
    const silentServerError = createHttpError({ message: 'Hidden failure', status: 500, silent: true })
    const serverError = createHttpError({ message: 'Server failed', status: 500 })

    expect(isExpectedHttpError(businessError)).toBe(true)
    expect(isExpectedHttpError(networkError)).toBe(true)
    expect(isExpectedHttpError(silentServerError)).toBe(true)
    expect(isExpectedHttpError(serverError)).toBe(false)
  })
})
