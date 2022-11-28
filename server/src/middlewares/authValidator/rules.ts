import { check } from 'express-validator'

export const rules = {
  registration: [
    check('username', 'Name is required').notEmpty(),
    check('password', 'Password cant be less than 6 letters').isLength({ min: 6 })
  ]
}
export default rules
