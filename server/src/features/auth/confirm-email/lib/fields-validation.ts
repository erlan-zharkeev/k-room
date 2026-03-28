import { requiredStringRule } from '../../../../shared/lib/utils/validation-rules'

export const CONFIRM_EMAIL_FIELDS_VALIDATION = [requiredStringRule('token')]
