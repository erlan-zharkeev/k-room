import { AUTH_ENDPOINTS, CODES_ENDPOINTS, MEDIA_ENDPOINTS, USER_ENDPOINTS } from 'common'
import { Router } from 'express'

import { multerUploader } from 'src/media'

import {
  accessTokenValidatorMiddleware,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  confirmEmailController,
  LOGIN_FIELDS_VALIDATION,
  loginController,
  logoutController,
  refreshTokenValidatorMiddleware,
  REGISTRATION_FIELDS_VALIDATION,
  registrationController,
  sendConfirmationLinkController,
  signInWithProviderController,
  updateTokensPairController
} from 'src/modules/auth'
import {
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  sendPasswordRecoveryCodeController,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validatePasswordRecoveryCodeController
} from 'src/modules/code'
import { getMediaFileController } from 'src/modules/media'
import {
  getUserDataController,
  RESET_PASSWORD_FIELDS_VALIDATION,
  resetPasswordController,
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  updateUserDataController
} from 'src/modules/user'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

export const rootRouter = Router()

rootRouter.post(
  AUTH_ENDPOINTS.confirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequestMiddleware,
  confirmEmailController
)
rootRouter.post(AUTH_ENDPOINTS.login, LOGIN_FIELDS_VALIDATION, validateRequestMiddleware, loginController)
rootRouter.post(
  AUTH_ENDPOINTS.registration,
  REGISTRATION_FIELDS_VALIDATION,
  validateRequestMiddleware,
  registrationController
)
rootRouter.post(AUTH_ENDPOINTS.sendEmailConfirmationLink, sendConfirmationLinkController)
rootRouter.post(AUTH_ENDPOINTS.providerLogin, signInWithProviderController)
rootRouter.post(AUTH_ENDPOINTS.updateTokensPair, refreshTokenValidatorMiddleware, updateTokensPairController)
rootRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidatorMiddleware, logoutController)

rootRouter.post(
  CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequestMiddleware,
  sendPasswordRecoveryCodeController
)
rootRouter.post(
  CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequestMiddleware,
  validatePasswordRecoveryCodeController
)

rootRouter.get(USER_ENDPOINTS.getUserData, accessTokenValidatorMiddleware, getUserDataController)
rootRouter.post(
  USER_ENDPOINTS.resetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequestMiddleware,
  resetPasswordController
)
rootRouter.patch(
  USER_ENDPOINTS.editUserData,
  accessTokenValidatorMiddleware,
  multerUploader.single('file'),
  UPDATE_USER_DATA_FIELDS_VALIDATION,
  validateRequestMiddleware,
  updateUserDataController
)

rootRouter.get(`${MEDIA_ENDPOINTS.getMediaFile}/:id`, accessTokenValidatorMiddleware, getMediaFileController)
