import { Router } from 'express'
import { AuthController, CommonController, CodesController, AdminController } from '../controllers'
import { accessTokenValidator, refreshTokenValidator, codesRequestValidator, validationRules } from '../middlewares'
import { AuthEndpointsEnum, CommonEndpointsEnum, CodesEndpointsEnum, AdminEndpointsEnum } from 'common-types'
import { adminRoleValidator } from '../middlewares/admin-validator'

export const router = Router()

router.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, AuthController.updateTokensPair)
router.post(AuthEndpointsEnum.Registration, validationRules.registration, AuthController.registration)
router.post(AuthEndpointsEnum.Login, AuthController.login)
router.post(AuthEndpointsEnum.ProviderLogin, AuthController.signInWithProvider)
router.post(AuthEndpointsEnum.SendEmailConfirmationLink, AuthController.sendConfirmationLink)
router.post(AuthEndpointsEnum.ConfirmEmail, AuthController.confirmEmail)

router.post(CommonEndpointsEnum.InfoItem, accessTokenValidator, CommonController.readInfoItem)
router.get(CommonEndpointsEnum.InfoItem, accessTokenValidator, CommonController.getInfoItem)
router.get(CommonEndpointsEnum.CommonImages, accessTokenValidator, CommonController.getImage)

router.get(AdminEndpointsEnum.GetAppData, accessTokenValidator, adminRoleValidator, AdminController.getAppData)
router.post(AdminEndpointsEnum.DBClear, accessTokenValidator, adminRoleValidator, AdminController.resetDB)
router.patch(AdminEndpointsEnum.ApplyFixtures, accessTokenValidator, adminRoleValidator, AdminController.applyFixtures)
router.post(AdminEndpointsEnum.DeleteUser, accessTokenValidator, adminRoleValidator, AdminController.deleteUser)
router.post(AdminEndpointsEnum.UpdateUserData, accessTokenValidator, adminRoleValidator, AdminController.updateUserData)
