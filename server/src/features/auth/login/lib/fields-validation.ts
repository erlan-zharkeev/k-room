import { check } from 'express-validator'

import { Message } from './message'

export const fieldsValidation = [
  check('email').notEmpty().withMessage(Message.EmailIsRequired),
  check('email').isEmail().withMessage(Message.InvalidEmailFormat),
  check('password').notEmpty().withMessage(Message.PasswordIsRequired)
]
