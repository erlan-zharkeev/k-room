import { emailRule, passwordRule, usernameRule } from 'src/features/auth'

export const REGISTRATION_FIELDS_VALIDATION = [emailRule(), usernameRule(), passwordRule()]
