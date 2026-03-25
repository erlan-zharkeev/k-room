import { emailRule, requiredStringRule } from 'features/auth'

export const fieldsValidation = [emailRule(), requiredStringRule('code')]
