import { requiredStringRule } from 'src/features/auth/shared'

export const CONFIRM_EMAIL_FIELDS_VALIDATION = [requiredStringRule('token')]
