import { Router } from 'express'
import { AuthController, UserController, CommonController, CodesController } from '../controllers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  codesRequestValidator,
  fileUploader,
  validationRules
} from '../middlewares'
import { AuthEndPoints, UserEndPoints, CommonEndPoints, CodesEndPoints } from '../@types'

export const router = Router()

router.get(AuthEndPoints.UPDATE_TOKENS_PAIR, refreshTokenValidator, AuthController.updateTokensPair)
router.post(AuthEndPoints.REGISTRATION, validationRules.registration, AuthController.registration)
router.post(AuthEndPoints.LOGIN, AuthController.login)
router.post(AuthEndPoints.PROVIDER_LOGIN, AuthController.signInWithProvider)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, AuthController.sendConfirmationLink)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION, AuthController.confirmEmail)

router.get(UserEndPoints.GET_USER_DATA, accessTokenValidator, UserController.getUserData)
router.post(
  UserEndPoints.UPDATE_USER_DATA,
  accessTokenValidator,
  fileUploader.single('file'),
  UserController.updateUserData
)
router.post(UserEndPoints.RESET_PASSWORD, accessTokenValidator, UserController.resetPassword)

router.post(CommonEndPoints.GET_INFO, accessTokenValidator, CommonController.readInfoHandler)
router.get(CommonEndPoints.COMMON_IMAGES, accessTokenValidator, CommonController.imagesHandler)

router.post(
  CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY,
  codesRequestValidator,
  CodesController.emailPasswordRecovery
)
router.post(
  CodesEndPoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY,
  accessTokenValidator,
  CodesController.validateEmailCodePasswordRecovery
)
