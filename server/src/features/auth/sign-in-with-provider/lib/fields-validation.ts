import { emailRule, providerRule, requiredStringRule } from 'features/auth'

export const fieldsValidation = [requiredStringRule('username'), emailRule(), providerRule()]
