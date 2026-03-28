import { check, oneOf } from 'express-validator'
import mongoose from 'mongoose'

import { providers, VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'common'

import { AUTH_MESSAGE } from '../../../features/auth/shared/config'

export const emailRule = () =>
  check('email')
    .notEmpty()
    .withMessage(AUTH_MESSAGE.emailIsRequired)
    .bail()
    .isEmail()
    .withMessage(AUTH_MESSAGE.invalidEmailFormat)

export const requiredStringRule = (field: string, msg = AUTH_MESSAGE.fieldIsRequired) =>
  check(field).notEmpty().withMessage(msg)

export const passwordRule = () =>
  check('password')
    .notEmpty()
    .withMessage(AUTH_MESSAGE.passwordIsRequired)
    .bail()
    .isLength({ min: VALIDATION_LIMITS.passwordMinLength })
    .withMessage(AUTH_MESSAGE.passwordMustBeAtLeast)
    .matches(new RegExp(VALIDATION_PATTERNS.passwordStrong))
    .withMessage(AUTH_MESSAGE.passwordMustBeStrong)
check('password')
  .not()
  .matches(new RegExp(VALIDATION_PATTERNS.noSpaces))
  .withMessage(AUTH_MESSAGE.passwordNotContainSpaces)
  .matches(new RegExp(VALIDATION_PATTERNS.onlyLatin))
  .withMessage(AUTH_MESSAGE.passwordMustContainOnlyLatin)

export const objectIdRule = (field: string) =>
  check(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(AUTH_MESSAGE.invalidId)

export const providerRule = (field = 'providerName') =>
  check(field)
    .exists({ checkNull: true })
    .withMessage(AUTH_MESSAGE.fieldIsRequired)
    .bail()
    .isIn([...providers])
    .withMessage(AUTH_MESSAGE.invalidProvider)

export const atLeastOneOf = (fields: string[], message = AUTH_MESSAGE.atLeastOneRequired) =>
  oneOf(
    fields.map((f) => check(f).exists({ checkNull: true, checkFalsy: true }).bail().notEmpty()),
    message
  )

export const usernameRule = () => {
  return check('username')
    .isLength({ min: VALIDATION_LIMITS.usernameMinLength })
    .withMessage(AUTH_MESSAGE.usernameTooShort)
    .isLength({ max: VALIDATION_LIMITS.usernameMaxLength })
    .withMessage(AUTH_MESSAGE.usernameTooLong)
}
