import { requiredStringRule } from 'src/features/auth'

export const RESET_PASSWORD_FIELDS_VALIDATION = [requiredStringRule('codeToValidate'), requiredStringRule('password')]
