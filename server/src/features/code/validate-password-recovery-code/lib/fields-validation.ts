import { emailRule, requiredStringRule } from 'src/features/auth'

export const fieldsValidation = [emailRule(), requiredStringRule('code')]
