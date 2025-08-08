import { check } from 'express-validator'

import { Message } from './message'

export const fieldsValidation = [
  check('email').notEmpty().withMessage(Message.EmailIsRequired),
  check('email').isEmail().withMessage(Message.InvalidEmailFormat),
  check('username', Message.UsernameRequired).notEmpty(),
  check('password', Message.PasswordCantBeLessThan)
    .isLength({ min: 6 })
    .withMessage(Message.PasswordMustBeAtLeast)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage(Message.PasswordMustContainBoth),
  check('password')
    .not()
    .matches(/\s/)
    .withMessage(Message.PasswordNotContainSpaces)
    .matches(/^[\x00-\x7F]+$/)
    .withMessage(Message.PasswordMustContainOnlyLatin)
]
