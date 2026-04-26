import type { ValidationChain } from 'express-validator'

import { passwordRule, requiredStringRule, usernameRule } from '../auth/auth.validation'

export const RESET_PASSWORD_VALIDATION: ValidationChain[] = [requiredStringRule('codeToValidate'), passwordRule()]
export const CHANGE_PASSWORD_VALIDATION: ValidationChain[] = [requiredStringRule('currentPassword'), passwordRule()]
export const UPDATE_USER_DATA_VALIDATION: ValidationChain[] = [usernameRule().optional()]
