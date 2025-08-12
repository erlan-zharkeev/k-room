import { emailRule, passwordRule, usernameRule } from 'features/auth'

export const fieldsValidation = [emailRule(), usernameRule(), passwordRule()]
