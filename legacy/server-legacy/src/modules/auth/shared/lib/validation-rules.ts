import { providers, VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'common'
import { check, oneOf } from 'express-validator'
import mongoose from 'mongoose'

import { AUTH_I18N } from '../config/i18n'

export const emailRule = () =>
  check('email')
    .notEmpty()
    .withMessage(AUTH_I18N.emailIsRequired)
    .bail()
    .isEmail()
    .withMessage(AUTH_I18N.invalidEmailFormat)

export const requiredStringRule = (field: string, msg = AUTH_I18N.fieldIsRequired) =>
  check(field).notEmpty().withMessage(msg)

export const passwordRule = () =>
  check('password')
    .notEmpty()
    .withMessage(AUTH_I18N.passwordIsRequired)
    .bail()
    .isLength({ min: VALIDATION_LIMITS.passwordMinLength })
    .withMessage(AUTH_I18N.passwordMustBeAtLeast)
    .matches(new RegExp(VALIDATION_PATTERNS.passwordStrong))
    .withMessage(AUTH_I18N.passwordMustBeStrong)
check('password')
  .not()
  .matches(new RegExp(VALIDATION_PATTERNS.noSpaces))
  .withMessage(AUTH_I18N.passwordNotContainSpaces)
  .matches(new RegExp(VALIDATION_PATTERNS.onlyLatin))
  .withMessage(AUTH_I18N.passwordMustContainOnlyLatin)

export const objectIdRule = (field: string) =>
  check(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(AUTH_I18N.invalidId)

export const providerRule = (field = 'providerName') =>
  check(field)
    .exists({ checkNull: true })
    .withMessage(AUTH_I18N.fieldIsRequired)
    .bail()
    .isIn([...providers])
    .withMessage(AUTH_I18N.invalidProvider)

export const atLeastOneOf = (fields: string[], message = AUTH_I18N.atLeastOneRequired) =>
  oneOf(
    fields.map((f) => check(f).exists({ checkNull: true, checkFalsy: true }).bail().notEmpty()),
    message
  )

export const usernameRule = () => {
  return check('username')
    .isLength({ min: VALIDATION_LIMITS.usernameMinLength })
    .withMessage(AUTH_I18N.usernameTooShort)
    .isLength({ max: VALIDATION_LIMITS.usernameMaxLength })
    .withMessage(AUTH_I18N.usernameTooLong)
}
