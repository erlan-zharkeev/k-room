import * as v from 'valibot'

import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../auth/constants'
import { EMAIL_CODE_LENGTH } from '../codes/constants'
import { providers } from '../shared/constants'

import { NON_EMPTY_PATTERN } from './constants'
import type { ValidationMessages } from './types'

const requiredStringSchema = (message: string) =>
  v.pipe(v.string(message), v.regex(NON_EMPTY_PATTERN, message), v.trim())

const captchaTokenSchema = (messages: ValidationMessages) => v.optional(requiredStringSchema(messages.fieldIsRequired))

const emailSchema = (messages: ValidationMessages) =>
  v.pipe(requiredStringSchema(messages.emailIsRequired), v.email(messages.invalidEmailFormat))

const emailCodeSchema = (messages: ValidationMessages) =>
  v.pipe(
    requiredStringSchema(messages.fieldIsRequired),
    v.length(EMAIL_CODE_LENGTH, messages.fieldIsRequired),
    v.regex(/^\d+$/, messages.fieldIsRequired)
  )

export const createPasswordSchema = (messages: ValidationMessages) =>
  v.pipe(
    requiredStringSchema(messages.passwordIsRequired),
    v.minLength(VALIDATION_LIMITS.passwordMinLength, messages.passwordMustBeAtLeast),
    v.regex(new RegExp(VALIDATION_PATTERNS.passwordStrong), messages.passwordMustBeStrong),
    v.regex(new RegExp(VALIDATION_PATTERNS.noSpaces), messages.passwordNotContainSpaces),
    v.regex(new RegExp(VALIDATION_PATTERNS.onlyLatin), messages.passwordMustContainOnlyLatin)
  )

const nicknameSchema = (messages: ValidationMessages) =>
  v.pipe(
    requiredStringSchema(messages.fieldIsRequired),
    v.regex(new RegExp(VALIDATION_PATTERNS.nickname), messages.nicknameInvalidFormat),
    v.minLength(VALIDATION_LIMITS.nicknameMinLength, messages.nicknameTooShort),
    v.maxLength(VALIDATION_LIMITS.nicknameMaxLength, messages.nicknameTooLong)
  )

export const createAuthLoginSchema = (messages: ValidationMessages) =>
  v.object({
    login: requiredStringSchema(messages.fieldIsRequired),
    password: requiredStringSchema(messages.passwordIsRequired),
    captchaToken: captchaTokenSchema(messages)
  })

export const createAuthRegistrationSchema = (messages: ValidationMessages) =>
  v.object({
    nickname: nicknameSchema(messages),
    email: emailSchema(messages),
    password: createPasswordSchema(messages),
    captchaToken: captchaTokenSchema(messages)
  })

export const createAuthRegistrationFormSchema = (messages: ValidationMessages) =>
  v.object({
    nickname: nicknameSchema(messages),
    email: emailSchema(messages),
    password: createPasswordSchema(messages),
    policy: v.literal(true, messages.fieldIsRequired)
  })

export const createConfirmEmailSchema = (messages: ValidationMessages) =>
  v.object({
    token: requiredStringSchema(messages.fieldIsRequired)
  })

export const createProviderLoginSchema = (messages: ValidationMessages) =>
  v.object({
    nickname: nicknameSchema(messages),
    email: emailSchema(messages),
    provider: v.picklist(providers, messages.invalidProvider)
  })

export const createSendPasswordRecoveryCodeSchema = (messages: ValidationMessages) =>
  v.object({
    email: emailSchema(messages),
    captchaToken: captchaTokenSchema(messages)
  })

export const createSendChangeEmailCodeSchema = createSendPasswordRecoveryCodeSchema

export const createSendConfirmationLinkSchema = createSendPasswordRecoveryCodeSchema

export const createValidatePasswordRecoveryCodeSchema = (messages: ValidationMessages) =>
  v.object({
    email: emailSchema(messages),
    code: emailCodeSchema(messages),
    captchaToken: captchaTokenSchema(messages)
  })

export const createValidateChangeEmailCodeSchema = createValidatePasswordRecoveryCodeSchema

export const createResetPasswordSchema = (messages: ValidationMessages) =>
  v.object({
    codeToValidate: requiredStringSchema(messages.fieldIsRequired),
    password: createPasswordSchema(messages)
  })

export const createChangePasswordSchema = (messages: ValidationMessages) =>
  v.object({
    currentPassword: requiredStringSchema(messages.fieldIsRequired),
    password: createPasswordSchema(messages)
  })

export const createUpdateUserDataSchema = (messages: ValidationMessages) =>
  v.object({
    nickname: v.optional(nicknameSchema(messages))
  })

export const createCreateNewPasswordFormSchema = (messages: ValidationMessages) =>
  v.object({
    firstPassword: createPasswordSchema(messages),
    secondPassword: createPasswordSchema(messages)
  })

export const createPasswordRecoveryEmailFormSchema = createSendPasswordRecoveryCodeSchema

export const createPasswordRecoveryCodeFormSchema = (messages: ValidationMessages) =>
  v.object({
    code: requiredStringSchema(messages.fieldIsRequired)
  })
