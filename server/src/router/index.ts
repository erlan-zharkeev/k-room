import { Router } from 'express'
import { AuthController, UserController, CommonController, CodesController, AdminController } from '../controllers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  codesRequestValidator,
  fileUploader,
  validationRules
} from '../middlewares'
import { AuthEndpoints, UserEndpoints, CommonEndpoints, CodesEndpoints, AdminEndpoints } from '../@types'
import { adminRoleValidator } from '../middlewares/admin-validator'

export const router = Router()

router.get(AuthEndpoints.UPDATE_TOKENS_PAIR, refreshTokenValidator, AuthController.updateTokensPair)
router.post(AuthEndpoints.REGISTRATION, validationRules.registration, AuthController.registration)
router.post(AuthEndpoints.LOGIN, AuthController.login)
router.post(AuthEndpoints.PROVIDER_LOGIN, AuthController.signInWithProvider)
router.post(AuthEndpoints.SEND_EMAIL_CONFIRMATION_LINK, AuthController.sendConfirmationLink)
router.post(AuthEndpoints.SEND_EMAIL_CONFIRMATION, AuthController.confirmEmail)

router.get(UserEndpoints.GET_USER_DATA, accessTokenValidator, UserController.getUserData)
router.post(
  UserEndpoints.UPDATE_USER_DATA,
  accessTokenValidator,
  fileUploader.single('file'),
  UserController.updateUserData
)
router.post(UserEndpoints.RESET_PASSWORD, UserController.resetPassword)

router.post(CommonEndpoints.GET_INFO, accessTokenValidator, CommonController.readInfoHandler)
router.get(CommonEndpoints.COMMON_IMAGES, accessTokenValidator, CommonController.imagesHandler)

router.post(
  CodesEndpoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY,
  codesRequestValidator,
  CodesController.emailPasswordRecovery
)
router.post(
  CodesEndpoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY,
  codesRequestValidator,
  CodesController.validateEmailCodePasswordRecovery
)

router.get(AdminEndpoints.GET_APP_DATA, accessTokenValidator, adminRoleValidator, AdminController.getAppData)
router.post(AdminEndpoints.DB_CLEAR, accessTokenValidator, adminRoleValidator, AdminController.resetDB)
router.patch(AdminEndpoints.APPLY_FIXTURES, accessTokenValidator, adminRoleValidator, AdminController.applyFixtures)
router.post(AdminEndpoints.DELETE_USER, accessTokenValidator, adminRoleValidator, AdminController.deleteUser)
router.post(AdminEndpoints.UPDATE_USER_DATA, accessTokenValidator, adminRoleValidator, AdminController.updateUserData)