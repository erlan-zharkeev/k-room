import { requiredStringRule } from 'src/shared/lib'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
