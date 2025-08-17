import { providers, VALIDATION_LIMITS, VALIDATION_PATTERNS } from 'common-types'
import { check, oneOf } from 'express-validator'
import mongoose from 'mongoose'

import { MESSAGE } from '../config'

export const emailRule = () =>
  check('email')
    .notEmpty()
    .withMessage(MESSAGE.emailIsRequired)
    .bail()
    .isEmail()
    .withMessage(MESSAGE.invalidEmailFormat)

export const requiredStringRule = (field: string, msg = MESSAGE.fieldIsRequired) =>
  check(field).notEmpty().withMessage(msg)

export const passwordRule = () =>
  check('password')
    .notEmpty()
    .withMessage(MESSAGE.passwordIsRequired)
    .bail()
    .isLength({ min: VALIDATION_LIMITS.passwordMinLength })
    .withMessage(MESSAGE.passwordMustBeAtLeast)
    .matches(new RegExp(VALIDATION_PATTERNS.passwordStrong))
    .withMessage(MESSAGE.passwordMustBeStrong)
check('password')
  .not()
  .matches(new RegExp(VALIDATION_PATTERNS.noSpaces))
  .withMessage(MESSAGE.passwordNotContainSpaces)
  .matches(new RegExp(VALIDATION_PATTERNS.onlyLatin))
  .withMessage(MESSAGE.passwordMustContainOnlyLatin)

export const objectIdRule = (field: string) =>
  check(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid id')

export const providerRule = (field = 'providerName') =>
  check(field)
    .exists({ checkNull: true })
    .withMessage(MESSAGE.fieldIsRequired)
    .bail()
    .isIn([...providers])
    .withMessage(MESSAGE.invalidProvider)

export const atLeastOneOf = (fields: string[], message = MESSAGE.atLeastOneRequired) =>
  oneOf(
    fields.map((f) => check(f).exists({ checkNull: true, checkFalsy: true }).bail().notEmpty()),
    message
  )

export const usernameRule = () => {
  return check('username')
    .isLength({ min: VALIDATION_LIMITS.usernameMinLength })
    .withMessage(MESSAGE.usernameTooShort)
    .isLength({ max: VALIDATION_LIMITS.usernameMaxLength })
    .withMessage(MESSAGE.usernameTooLong)
}
