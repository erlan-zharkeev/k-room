import { emailRule, passwordRule, usernameRule } from 'src/shared/lib'

export const REGISTRATION_FIELDS_VALIDATION = [emailRule(), usernameRule(), passwordRule()]
