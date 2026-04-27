import { createChangePasswordSchema, createResetPasswordSchema, createUpdateUserDataSchema } from 'global-shared'

export const RESET_PASSWORD_VALIDATION = createResetPasswordSchema
export const CHANGE_PASSWORD_VALIDATION = createChangePasswordSchema
export const UPDATE_USER_DATA_VALIDATION = createUpdateUserDataSchema
