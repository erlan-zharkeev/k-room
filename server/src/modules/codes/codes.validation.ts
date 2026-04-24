import type { ValidationChain } from 'express-validator'

import { emailRule, requiredStringRule } from '../auth/auth.validation'

export const SEND_PASSWORD_RECOVERY_CODE_VALIDATION: ValidationChain[] = [emailRule()]
export const VALIDATE_PASSWORD_RECOVERY_CODE_VALIDATION: ValidationChain[] = [emailRule(), requiredStringRule('code')]
