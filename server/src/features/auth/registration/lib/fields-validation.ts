import { emailRule, passwordRule, usernameRule } from 'src/features/auth'

export const fieldsValidation = [emailRule(), usernameRule(), passwordRule()]
