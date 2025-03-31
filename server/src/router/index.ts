import { Router } from 'express'
import { AuthController, UserController, CommonController, CodesController, AdminController } from '../controllers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  codesRequestValidator,
  fileUploader,
  validationRules
} from '../middlewares'
import {
  AuthEndpointsEnum,
  UserEndpointsEnum,
  CommonEndpointsEnum,
  CodesEndpointsEnum,
  AdminEndpointsEnum
} from '../@types'
import { adminRoleValidator } from '../middlewares/admin-validator'

export const router = Router()

router.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, AuthController.updateTokensPair)
router.post(AuthEndpointsEnum.Registration, validationRules.registration, AuthController.registration)
router.post(AuthEndpointsEnum.Login, AuthController.login)
router.post(AuthEndpointsEnum.ProviderLogin, AuthController.signInWithProvider)
router.post(AuthEndpointsEnum.SendEmailConfirmationLink, AuthController.sendConfirmationLink)
router.post(AuthEndpointsEnum.SendEmailConfirmation, AuthController.confirmEmail)

router.get(UserEndpointsEnum.GetUserData, accessTokenValidator, UserController.getUserData)
router.post(
  UserEndpointsEnum.UpdateUserData,
  accessTokenValidator,
  fileUploader.single('file'),
  UserController.updateUserData
)
router.post(UserEndpointsEnum.ResetPassword, UserController.resetPassword)

router.post(CommonEndpointsEnum.GetInfo, accessTokenValidator, CommonController.readInfoHandler)
router.get(CommonEndpointsEnum.CommonImages, accessTokenValidator, CommonController.imagesHandler)

router.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  codesRequestValidator,
  CodesController.emailPasswordRecovery
)
router.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  codesRequestValidator,
  CodesController.validateEmailCodePasswordRecovery
)

router.get(AdminEndpointsEnum.GetAppData, accessTokenValidator, adminRoleValidator, AdminController.getAppData)
router.post(AdminEndpointsEnum.DBClear, accessTokenValidator, adminRoleValidator, AdminController.resetDB)
router.patch(AdminEndpointsEnum.ApplyFixtures, accessTokenValidator, adminRoleValidator, AdminController.applyFixtures)
router.post(AdminEndpointsEnum.DeleteUser, accessTokenValidator, adminRoleValidator, AdminController.deleteUser)
router.post(AdminEndpointsEnum.UpdateUserData, accessTokenValidator, adminRoleValidator, AdminController.updateUserData)
