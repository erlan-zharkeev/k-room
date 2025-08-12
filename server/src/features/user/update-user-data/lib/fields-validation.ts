import { emailRule, usernameRule } from 'features/auth'

export const fieldsValidation = [emailRule(), usernameRule({ ifPresent: true })]
