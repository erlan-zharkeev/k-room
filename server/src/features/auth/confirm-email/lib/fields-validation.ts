import { requiredStringRule } from 'src/features/auth'

export const CONFIRM_EMAIL_FIELDS_VALIDATION = [requiredStringRule('token')]
