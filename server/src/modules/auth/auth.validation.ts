import { check, type ValidationChain } from 'express-validator'
import { VALIDATION_LIMITS, VALIDATION_PATTERNS, providers } from 'shared'

import { AUTH_I18N } from './auth.i18n'

const requiredStringRule = (field: string, message = AUTH_I18N.fieldIsRequired) => {
  return check(field).notEmpty().withMessage(message)
}

const emailRule = () => {
  return check('email')
    .notEmpty()
    .withMessage(AUTH_I18N.emailIsRequired)
    .bail()
    .isEmail()
    .withMessage(AUTH_I18N.invalidEmailFormat)
}

const passwordRule = () => {
  return check('password')
    .notEmpty()
    .withMessage(AUTH_I18N.passwordIsRequired)
    .bail()
    .isLength({ min: VALIDATION_LIMITS.passwordMinLength })
    .withMessage(AUTH_I18N.passwordMustBeAtLeast)
    .bail()
    .matches(new RegExp(VALIDATION_PATTERNS.passwordStrong))
    .withMessage(AUTH_I18N.passwordMustBeStrong)
    .bail()
    .matches(new RegExp(VALIDATION_PATTERNS.noSpaces))
    .withMessage(AUTH_I18N.passwordNotContainSpaces)
    .bail()
    .matches(new RegExp(VALIDATION_PATTERNS.onlyLatin))
    .withMessage(AUTH_I18N.passwordMustContainOnlyLatin)
}

const usernameRule = () => {
  return check('username')
    .isLength({ min: VALIDATION_LIMITS.usernameMinLength })
    .withMessage(AUTH_I18N.usernameTooShort)
    .bail()
    .isLength({ max: VALIDATION_LIMITS.usernameMaxLength })
    .withMessage(AUTH_I18N.usernameTooLong)
}

const providerRule = () => {
  return check('provider')
    .exists({ checkNull: true })
    .withMessage(AUTH_I18N.fieldIsRequired)
    .bail()
    .isIn([...providers])
    .withMessage(AUTH_I18N.invalidProvider)
}

export const LOGIN_VALIDATION: ValidationChain[] = [requiredStringRule('email'), requiredStringRule('password')]
export const REGISTRATION_VALIDATION: ValidationChain[] = [emailRule(), usernameRule(), passwordRule()]
export const CONFIRM_EMAIL_VALIDATION: ValidationChain[] = [requiredStringRule('token')]
export const PROVIDER_LOGIN_VALIDATION: ValidationChain[] = [
  requiredStringRule('username'),
  emailRule(),
  providerRule()
]
