import { check } from 'express-validator'

export const validationRules = {
  registration: [
    check('username', 'Name is required').notEmpty(),
    check('password', 'Password cant be less than 6 letters').isLength({ min: 6 })
  ]
}
