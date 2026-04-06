import { requiredStringRule } from '../../shared'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
