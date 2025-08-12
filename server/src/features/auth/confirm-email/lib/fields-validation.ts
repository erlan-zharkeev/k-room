import { objectIdRule, requiredStringRule } from 'features/auth'

export const fieldsValidation = [requiredStringRule('email'), objectIdRule('userId')]
