import { Router } from 'express'
import { AuthEndPoints, CodesEndPoints, CommonEndPoints, UserEndPoints } from '../../../types'
import authController from '../controllers/authController'
import validationRules from '../middlewares/authValidator/rules'
import accessTokenValidator from '../middlewares/accessTokenValidator'
import refreshTokenValidator from '../middlewares/refreshTokenValidator'
import codesRequestValidator from '../middlewares/codesRequestValidator'
import commonController from '../controllers/commonController'
import userController from '../controllers/userController'
import codesController from '../controllers/codesController'
import fileUploader from '../middlewares/fileUploader'

const router = Router()

router.get(AuthEndPoints.UPDATE_TOKENS_PAIR, refreshTokenValidator, authController.updateTokensPair)
router.post(AuthEndPoints.REGISTRATION, validationRules.registration, authController.registration)
router.post(AuthEndPoints.LOGIN, authController.login)
router.post(AuthEndPoints.PROVIDER_LOGIN, authController.signInWithProvider)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, authController.sendConfirmationLink)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION, authController.confirmEmail)

router.get(UserEndPoints.GET_USER_DATA, accessTokenValidator, userController.getUserData)
router.post(UserEndPoints.UPDATE_USER_DATA, fileUploader.single('file'), userController.updateUserData)
router.post(UserEndPoints.RESET_PASSWORD, userController.resetPassword)

router.post(CommonEndPoints.GET_INFO, commonController.readInfoHandler)
router.get(CommonEndPoints.COMMON_IMAGES, commonController.imagesHandler)

router.post(
  CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY,
  codesRequestValidator,
  codesController.emailPasswordRecovery
)
router.post(CodesEndPoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY, codesController.validateEmailCodePasswordRecovery)

export default router
