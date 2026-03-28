import { emailRule, providerRule, requiredStringRule } from 'src/shared/lib'

export const SIGN_IN_WITH_PROVIDER_FIELDS_VALIDATION = [requiredStringRule('username'), emailRule(), providerRule()]
