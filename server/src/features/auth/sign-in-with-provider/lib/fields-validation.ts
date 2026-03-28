import { emailRule, providerRule, requiredStringRule } from 'src/features/auth'

export const fieldsValidation = [requiredStringRule('username'), emailRule(), providerRule()]
