import { VALIDATION_LIMITS, VALIDATION_PATTERNS, type LocalizedTextType } from 'global-shared'

import { FORM_VALIDATION_I18N } from 'src/shared/config'

import type { FormValidationRuleType } from './types'

export const requiredStringRule =
  (message: LocalizedTextType = FORM_VALIDATION_I18N.fieldIsRequired): FormValidationRuleType<string> =>
  (value) =>
    value.trim() ? null : message

export const requiredTrueRule =
  (message: LocalizedTextType = FORM_VALIDATION_I18N.fieldIsRequired): FormValidationRuleType<boolean> =>
  (value) =>
    value ? null : message

export const minLengthRule =
  (minLength: number, message: LocalizedTextType): FormValidationRuleType<string> =>
  (value) =>
    value.length >= minLength ? null : message

export const maxLengthRule =
  (maxLength: number, message: LocalizedTextType): FormValidationRuleType<string> =>
  (value) =>
    value.length <= maxLength ? null : message

export const patternRule =
  (pattern: string, message: LocalizedTextType): FormValidationRuleType<string> =>
  (value) =>
    new RegExp(pattern).test(value) ? null : message

export const requiredEmailRule = requiredStringRule(FORM_VALIDATION_I18N.emailIsRequired)
export const requiredPasswordRule = requiredStringRule(FORM_VALIDATION_I18N.passwordIsRequired)
export const requiredAgreementRule = requiredTrueRule(FORM_VALIDATION_I18N.fieldIsRequired)
export const validEmailRule = patternRule(VALIDATION_PATTERNS.email, FORM_VALIDATION_I18N.invalidEmailFormat)
export const usernameMinLengthRule = minLengthRule(
  VALIDATION_LIMITS.usernameMinLength,
  FORM_VALIDATION_I18N.usernameTooShort
)
export const usernameMaxLengthRule = maxLengthRule(
  VALIDATION_LIMITS.usernameMaxLength,
  FORM_VALIDATION_I18N.usernameTooLong
)
export const passwordMinLengthRule = minLengthRule(
  VALIDATION_LIMITS.passwordMinLength,
  FORM_VALIDATION_I18N.passwordMustBeAtLeast
)
export const strongPasswordRule = patternRule(
  VALIDATION_PATTERNS.passwordStrong,
  FORM_VALIDATION_I18N.passwordMustBeStrong
)
