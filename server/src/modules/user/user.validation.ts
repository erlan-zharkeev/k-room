import {
  createChangePasswordSchema,
  createResetPasswordSchema,
  createUpdateUserDataSchema,
  createUpdateUserOnboardingSchema
} from 'global-shared'

export const RESET_PASSWORD_VALIDATION = createResetPasswordSchema
export const CHANGE_PASSWORD_VALIDATION = createChangePasswordSchema
export const UPDATE_USER_DATA_VALIDATION = createUpdateUserDataSchema
export const UPDATE_USER_ONBOARDING_VALIDATION = createUpdateUserOnboardingSchema
