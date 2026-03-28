import { requiredStringRule } from '../../../../shared/lib/utils/validation-rules'

export const LOGIN_FIELDS_VALIDATION = [requiredStringRule('email'), requiredStringRule('password')]
