import { emailRule, requiredStringRule } from 'src/features/auth'

export const VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION = [emailRule(), requiredStringRule('code')]
