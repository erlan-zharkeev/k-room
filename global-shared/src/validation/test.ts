import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { createAuthRegistrationSchema, createValidationMessages } from '../index'

const messages = createValidationMessages((value) => value.en)

describe('validation contracts', () => {
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
})
