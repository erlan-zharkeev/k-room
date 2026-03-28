import { requiredStringRule } from '../../shared/lib/validation-rules'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
