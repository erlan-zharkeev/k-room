import { emailRule } from 'src/modules/auth'

export const SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION = [emailRule()]
