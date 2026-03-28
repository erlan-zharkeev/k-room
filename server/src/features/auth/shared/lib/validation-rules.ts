import { check, oneOf } from 'express-validator'
import mongoose from 'mongoose'

import { providers, VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'common'

import { I18N_AUTH_MESSAGE } from './../config'

export const emailRule = () =>
  check('email')
    .notEmpty()
    .withMessage(I18N_AUTH_MESSAGE.emailIsRequired)
    .bail()
    .isEmail()
    .withMessage(I18N_AUTH_MESSAGE.invalidEmailFormat)

export const requiredStringRule = (field: string, msg = I18N_AUTH_MESSAGE.fieldIsRequired) =>
  check(field).notEmpty().withMessage(msg)

export const passwordRule = () =>
  check('password')
    .notEmpty()
    .withMessage(I18N_AUTH_MESSAGE.passwordIsRequired)
    .bail()
    .isLength({ min: VALIDATION_LIMITS.passwordMinLength })
    .withMessage(I18N_AUTH_MESSAGE.passwordMustBeAtLeast)
    .matches(new RegExp(VALIDATION_PATTERNS.passwordStrong))
    .withMessage(I18N_AUTH_MESSAGE.passwordMustBeStrong)
check('password')
  .not()
  .matches(new RegExp(VALIDATION_PATTERNS.noSpaces))
  .withMessage(I18N_AUTH_MESSAGE.passwordNotContainSpaces)
  .matches(new RegExp(VALIDATION_PATTERNS.onlyLatin))
  .withMessage(I18N_AUTH_MESSAGE.passwordMustContainOnlyLatin)

export const objectIdRule = (field: string) =>
  check(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(I18N_AUTH_MESSAGE.invalidId)

export const providerRule = (field = 'providerName') =>
  check(field)
    .exists({ checkNull: true })
    .withMessage(I18N_AUTH_MESSAGE.fieldIsRequired)
    .bail()
    .isIn([...providers])
    .withMessage(I18N_AUTH_MESSAGE.invalidProvider)

export const atLeastOneOf = (fields: string[], message = I18N_AUTH_MESSAGE.atLeastOneRequired) =>
  oneOf(
    fields.map((f) => check(f).exists({ checkNull: true, checkFalsy: true }).bail().notEmpty()),
    message
  )

export const usernameRule = () => {
  return check('username')
    .isLength({ min: VALIDATION_LIMITS.usernameMinLength })
    .withMessage(I18N_AUTH_MESSAGE.usernameTooShort)
    .isLength({ max: VALIDATION_LIMITS.usernameMaxLength })
    .withMessage(I18N_AUTH_MESSAGE.usernameTooLong)
}
