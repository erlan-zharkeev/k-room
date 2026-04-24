import { emailRule, providerRule, requiredStringRule } from '../../shared/lib/validation-rules'

export const SIGN_IN_WITH_PROVIDER_FIELDS_VALIDATION = [requiredStringRule('username'), emailRule(), providerRule()]
