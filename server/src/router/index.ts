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

router.get(AuthEndpoints.UpdateTokensPair, refreshTokenValidator, AuthController.updateTokensPair)
router.post(AuthEndpoints.Registration, validationRules.registration, AuthController.registration)
router.post(AuthEndpoints.Login, AuthController.login)
router.post(AuthEndpoints.ProviderLogin, AuthController.signInWithProvider)
router.post(AuthEndpoints.SendEmailConfirmationLink, AuthController.sendConfirmationLink)
router.post(AuthEndpoints.SendEmailConfirmation, AuthController.confirmEmail)

router.get(UserEndpoints.GetUserData, accessTokenValidator, UserController.getUserData)
router.post(
  UserEndpoints.UpdateUserData,
  accessTokenValidator,
  fileUploader.single('file'),
  UserController.updateUserData
)
router.post(UserEndpoints.ResetPassword, UserController.resetPassword)

router.post(CommonEndpoints.GetInfo, accessTokenValidator, CommonController.readInfoHandler)
router.get(CommonEndpoints.CommonImages, accessTokenValidator, CommonController.imagesHandler)

router.post(CodesEndpoints.SendEmailCodePasswordRecovery, codesRequestValidator, CodesController.emailPasswordRecovery)
router.post(
  CodesEndpoints.ValidateEmailCodePasswordRecovery,
  codesRequestValidator,
  CodesController.validateEmailCodePasswordRecovery
)

router.get(AdminEndpoints.GetAppData, accessTokenValidator, adminRoleValidator, AdminController.getAppData)
router.post(AdminEndpoints.DBClear, accessTokenValidator, adminRoleValidator, AdminController.resetDB)
router.patch(AdminEndpoints.ApplyFixtures, accessTokenValidator, adminRoleValidator, AdminController.applyFixtures)
router.post(AdminEndpoints.DeleteUser, accessTokenValidator, adminRoleValidator, AdminController.deleteUser)
router.post(AdminEndpoints.UpdateUserData, accessTokenValidator, adminRoleValidator, AdminController.updateUserData)
