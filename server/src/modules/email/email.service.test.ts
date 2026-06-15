import { REQ_STATUS, ROUTE_NAMES } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    stage: 'development',
    isE2E: false,
    isDev: true,
    clientUrl: 'https://localhost:43111',
    secret: {
      resendApiKey: ''
    },
    info: {
      appName: 'K Room'
    }
  }
}))

const logMock = vi.hoisted(() => ({
  log: {
    success: vi.fn(),
    warn: vi.fn()
  }
}))

const resendSendMock = vi.hoisted(() => vi.fn())
const resendCtorMock = vi.hoisted(() => vi.fn(() => ({ emails: { send: resendSendMock } })))

vi.mock('src/app/env', () => envMock)
vi.mock('src/shared/lib/log', () => logMock)
vi.mock('resend', () => ({
  Resend: resendCtorMock
}))

const { EmailService } = await import('./email.service')
const { renderEmailConfirmationHtml } = await import('./render-email-confirmation-html')

describe('email.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    envMock.SERVER_ENV.stage = 'development'
    envMock.SERVER_ENV.isE2E = false
    envMock.SERVER_ENV.isDev = true
    envMock.SERVER_ENV.secret.resendApiKey = ''
  })

  it('renders confirmation html with confirm url and nickname', () => {
    const html = renderEmailConfirmationHtml({
      appName: 'K Room',
      confirmUrl: 'https://localhost/confirm?token=abc',
      nickname: 'Tester'
    })

    expect(html).toContain('K Room')
    expect(html).toContain('Hi, Tester!')
    expect(html).toContain('https://localhost/confirm?token=abc')
  })

  it('returns mock confirmation email result in dev without resend key', async () => {
    const service = new EmailService()

    const result = await service.sendEmailConfirmationEmail({
      email: 'user@test.com',
      token: 'token-1',
      nickname: 'Tester'
    })

    const confirmUrl = new URL(ROUTE_NAMES.emailConfirmation, envMock.SERVER_ENV.clientUrl)

    confirmUrl.searchParams.set('token', 'token-1')
    expect(result).toEqual({ id: 'mock-resend-id' })
    expect(logMock.log.warn).toHaveBeenCalledWith(`-Mock confirmation email for user@test.com: ${confirmUrl}`)
    expect(resendCtorMock).not.toHaveBeenCalled()
  })

  it('rejects missing recipient and missing confirmation token', async () => {
    const service = new EmailService()

    await expect(
      service.sendEmailConfirmationEmail({
        email: '',
        token: 'token-1',
        nickname: 'Tester'
      })
    ).rejects.toMatchObject({
      status: REQ_STATUS.server
    })
    await expect(
      service.sendEmailConfirmationEmail({
        email: 'user@test.com',
        token: '',
        nickname: 'Tester'
      })
    ).rejects.toMatchObject({
      status: REQ_STATUS.server
    })
  })

  it('sends password recovery email through resend when key exists', async () => {
    envMock.SERVER_ENV.secret.resendApiKey = 'resend-key'
    resendSendMock.mockResolvedValue({
      data: {
        id: 'resend-id'
      },
      error: null
    })

    const service = new EmailService()
    const result = await service.sendPasswordRecoveryEmail({
      email: 'user@test.com',
      code: '123456',
      nickname: 'Tester'
    })

    expect(result).toEqual({ id: 'resend-id' })
    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: 'K Room: Password recovery code',
        html: expect.stringContaining('123456')
      })
    )
  })

  it('returns mock email in e2e mode even when resend key exists', async () => {
    envMock.SERVER_ENV.isE2E = true
    envMock.SERVER_ENV.secret.resendApiKey = 'resend-key'

    const service = new EmailService()
    const result = await service.sendPasswordRecoveryEmail({
      email: 'user@test.com',
      code: '123456',
      nickname: 'Tester'
    })

    expect(result).toEqual({ id: 'mock-recovery-email-id' })
    expect(resendCtorMock).not.toHaveBeenCalled()
  })
})
