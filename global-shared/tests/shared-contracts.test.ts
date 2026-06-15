import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import {
  CONTACT_INTERACTION,
  ROUTE_NAMES,
  createAuthRegistrationSchema,
  createValidationMessages,
  formatHumanDateTime,
  formatPlural,
  getRoomInterlocutorId,
  getRoomOtherUserIds,
  isAcceptedContactInteraction,
  isIgnoredSentryStatus,
  isInviteReceivedContactInteraction,
  isNicknameValid,
  normalizeNicknameKey,
  normalizeTimestamp,
  parseEnvContent,
  readEnv,
  readSecretEnv,
  shouldIgnoreSentryError
} from '../src'

const messages = createValidationMessages((value) => value.en)

describe('global-shared contracts', () => {
  it('keeps auth routes and app routes stable', () => {
    expect(ROUTE_NAMES.authLogin).toBe('/authorize/login')
    expect(ROUTE_NAMES.authRegistration).toBe('/authorize/registration')
    expect(ROUTE_NAMES.app).toBe('/app')
    expect(ROUTE_NAMES.emailConfirmation).toBe('/page/email-confirmation')
    expect(ROUTE_NAMES.download).toBe('/download')
    expect(ROUTE_NAMES.notification).toBe('/notification')
    expect(ROUTE_NAMES.notFound).toBe('/not-found')
  })

  it('validates registration payloads with shared schema rules', () => {
    const schema = createAuthRegistrationSchema(messages)
    const validPayload = {
      nickname: 'tester',
      email: 'tester@example.com',
      password: 'Asdf1234',
      captchaToken: 'captcha'
    }
    const invalidPayload = {
      nickname: 'Bad Nick',
      email: 'bad-email',
      password: 'short',
      captchaToken: ''
    }

    expect(v.safeParse(schema, validPayload).success).toBe(true)
    expect(v.safeParse(schema, invalidPayload).success).toBe(false)
  })

  it('normalizes env content and resolves runtime values before env file values', () => {
    const parsed = parseEnvContent('APP_HOST="https://example.com"\nEMPTY=\n# comment\nSERVER_PORT=43117')
    const secretEnv = readSecretEnv('missing.env', {
      existsSync: () => false,
      readFileSync: () => ''
    })

    expect(parsed).toEqual({
      APP_HOST: 'https://example.com',
      EMPTY: '',
      SERVER_PORT: '43117'
    })
    expect(secretEnv).toEqual({})
    expect(
      readEnv('APP_HOST', parsed, {
        runtimeEnv: { APP_HOST: 'https://runtime.example.com' },
        secretEnv
      })
    ).toBe('https://runtime.example.com')
  })

  it('keeps contact interaction helpers aligned with interaction constants', () => {
    expect(isAcceptedContactInteraction(CONTACT_INTERACTION.INVITE_ACCEPTED)).toBe(true)
    expect(isInviteReceivedContactInteraction(CONTACT_INTERACTION.INVITE_RECEIVED)).toBe(true)
    expect(isAcceptedContactInteraction(CONTACT_INTERACTION.INVITED)).toBe(false)
  })

  it('resolves chat room user ids without including current user', () => {
    const room = {
      users: ['user-1', 'user-2', 'user-3']
    }

    expect(getRoomOtherUserIds(room, 'user-1')).toEqual(['user-2', 'user-3'])
    expect(getRoomInterlocutorId(room, 'user-1')).toBe('user-2')
  })

  it('normalizes nicknames and timestamps predictably', () => {
    expect(normalizeNicknameKey(' Tester ')).toBe('tester')
    expect(isNicknameValid('tester-1')).toBe(true)
    expect(isNicknameValid('Tester 1')).toBe(false)
    expect(normalizeTimestamp('42')).toBe(42)
    expect(normalizeTimestamp('bad')).toBeNull()
  })

  it('formats plural and human date values through shared helpers', () => {
    expect(formatPlural('en', 1, { one: 'item', other: 'items' })).toBe('1 item')
    expect(formatPlural('en', 2, { one: 'item', other: 'items' })).toBe('2 items')
    expect(formatHumanDateTime(null, 'en-US', 'Never')).toBe('Never')
  })

  it('ignores expected sentry noise by status and context', () => {
    expect(isIgnoredSentryStatus(404)).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Network Error', silent: false })).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Fatal', silent: true })).toBe(true)
    expect(shouldIgnoreSentryError({ message: 'Fatal', silent: false, status: 500 })).toBe(false)
  })
})
