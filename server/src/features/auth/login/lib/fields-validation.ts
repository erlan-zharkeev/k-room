import { requiredStringRule } from 'src/features/auth'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
