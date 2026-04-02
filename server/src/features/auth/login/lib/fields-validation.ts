import { requiredStringRule } from 'src/features/auth/shared'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
