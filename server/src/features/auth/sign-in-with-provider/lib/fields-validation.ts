import { emailRule, providerRule, requiredStringRule } from 'src/features/auth/shared'

export const SIGN_IN_WITH_PROVIDER_FIELDS_VALIDATION = [requiredStringRule('username'), emailRule(), providerRule()]
