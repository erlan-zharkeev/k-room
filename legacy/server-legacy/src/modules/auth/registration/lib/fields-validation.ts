import { emailRule, passwordRule, usernameRule } from '../../shared/lib/validation-rules'

export const REGISTRATION_FIELDS_VALIDATION = [emailRule(), usernameRule(), passwordRule()]
