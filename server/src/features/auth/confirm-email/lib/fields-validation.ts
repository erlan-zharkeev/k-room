import { requiredStringRule } from '../../shared/lib/validation-rules'

export const CONFIRM_EMAIL_FIELDS_VALIDATION = [requiredStringRule('token')]
