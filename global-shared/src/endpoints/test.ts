import { describe, expect, it } from 'vitest'

import { CLIENT_RUNTIME_ENDPOINTS, ROUTE_NAMES } from '../index'

describe('endpoint contracts', () => {
  it('keeps auth routes and app routes stable', () => {
    expect(ROUTE_NAMES.authLogin).toBe('/authorize/login')
    expect(ROUTE_NAMES.authRegistration).toBe('/authorize/registration')
    expect(ROUTE_NAMES.app).toBe('/app')
    expect(ROUTE_NAMES.emailConfirmation).toBe('/page/email-confirmation')
    expect(ROUTE_NAMES.download).toBe('/download')
    expect(ROUTE_NAMES.notification).toBe('/notification')
    expect(ROUTE_NAMES.notFound).toBe('/not-found')
    expect(CLIENT_RUNTIME_ENDPOINTS.getRuntimePolicy).toBe('/client/runtime-policy')
  })
})
