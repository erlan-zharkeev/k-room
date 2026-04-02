import { emailRule, passwordRule, usernameRule } from './../../shared'

export const REGISTRATION_FIELDS_VALIDATION = [emailRule(), usernameRule(), passwordRule()]
