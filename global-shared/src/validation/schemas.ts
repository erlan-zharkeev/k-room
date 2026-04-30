import * as v from 'valibot'

import { VALIDATION_LIMITS, VALIDATION_PATTERNS } from '../auth/constants'
import { providers } from '../shared/constants'

import type { ValidationMessagesType } from './types'

const requiredStringSchema = (message: string) => v.pipe(v.string(message), v.trim(), v.nonEmpty(message))

const emailSchema = (messages: ValidationMessagesType) =>
  v.pipe(requiredStringSchema(messages.emailIsRequired), v.email(messages.invalidEmailFormat))

export const createPasswordSchema = (messages: ValidationMessagesType) =>
  v.pipe(
    requiredStringSchema(messages.passwordIsRequired),
    v.minLength(VALIDATION_LIMITS.passwordMinLength, messages.passwordMustBeAtLeast),
    v.regex(new RegExp(VALIDATION_PATTERNS.passwordStrong), messages.passwordMustBeStrong),
    v.regex(new RegExp(VALIDATION_PATTERNS.noSpaces), messages.passwordNotContainSpaces),
    v.regex(new RegExp(VALIDATION_PATTERNS.onlyLatin), messages.passwordMustContainOnlyLatin)
  )

const usernameSchema = (messages: ValidationMessagesType) =>
  v.pipe(
    requiredStringSchema(messages.fieldIsRequired),
    v.minLength(VALIDATION_LIMITS.usernameMinLength, messages.usernameTooShort),
    v.maxLength(VALIDATION_LIMITS.usernameMaxLength, messages.usernameTooLong)
  )

export const createAuthLoginSchema = (messages: ValidationMessagesType) =>
  v.object({
    email: requiredStringSchema(messages.emailIsRequired),
    password: requiredStringSchema(messages.passwordIsRequired)
  })

export const createAuthRegistrationSchema = (messages: ValidationMessagesType) =>
  v.object({
    username: usernameSchema(messages),
    email: emailSchema(messages),
    password: createPasswordSchema(messages)
  })

export const createAuthRegistrationFormSchema = (messages: ValidationMessagesType) =>
  v.object({
    username: usernameSchema(messages),
    email: emailSchema(messages),
    password: createPasswordSchema(messages),
    policy: v.literal(true, messages.fieldIsRequired)
  })

export const createConfirmEmailSchema = (messages: ValidationMessagesType) =>
  v.object({
    token: requiredStringSchema(messages.fieldIsRequired)
  })

export const createProviderLoginSchema = (messages: ValidationMessagesType) =>
  v.object({
    username: requiredStringSchema(messages.fieldIsRequired),
    email: emailSchema(messages),
    provider: v.picklist(providers, messages.invalidProvider)
  })

export const createSendPasswordRecoveryCodeSchema = (messages: ValidationMessagesType) =>
  v.object({
    email: emailSchema(messages)
  })

export const createSendConfirmationLinkSchema = createSendPasswordRecoveryCodeSchema

export const createValidatePasswordRecoveryCodeSchema = (messages: ValidationMessagesType) =>
  v.object({
    email: emailSchema(messages),
    code: requiredStringSchema(messages.fieldIsRequired)
  })

export const createResetPasswordSchema = (messages: ValidationMessagesType) =>
  v.object({
    codeToValidate: requiredStringSchema(messages.fieldIsRequired),
    password: createPasswordSchema(messages)
  })

export const createChangePasswordSchema = (messages: ValidationMessagesType) =>
  v.object({
    currentPassword: requiredStringSchema(messages.fieldIsRequired),
    password: createPasswordSchema(messages)
  })

export const createUpdateUserDataSchema = (messages: ValidationMessagesType) =>
  v.object({
    username: v.optional(usernameSchema(messages))
  })

export const createCreateNewPasswordFormSchema = (messages: ValidationMessagesType) =>
  v.object({
    firstPassword: createPasswordSchema(messages),
    secondPassword: createPasswordSchema(messages)
  })

export const createPasswordRecoveryEmailFormSchema = createSendPasswordRecoveryCodeSchema

export const createPasswordRecoveryCodeFormSchema = (messages: ValidationMessagesType) =>
  v.object({
    code: requiredStringSchema(messages.fieldIsRequired)
  })
