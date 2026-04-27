import {
  createAuthLoginSchema,
  createAuthRegistrationSchema,
  createConfirmEmailSchema,
  createProviderLoginSchema,
  createSendConfirmationLinkSchema
} from 'global-shared'

export const LOGIN_VALIDATION = createAuthLoginSchema
export const REGISTRATION_VALIDATION = createAuthRegistrationSchema
export const CONFIRM_EMAIL_VALIDATION = createConfirmEmailSchema
export const PROVIDER_LOGIN_VALIDATION = createProviderLoginSchema
export const SEND_CONFIRMATION_LINK_VALIDATION = createSendConfirmationLinkSchema
