import { Router } from 'express'
import { AuthEndPoints, CodesEndPoints, CommonEndPoints, UserEndPoints } from '../../../types'
import authController from '../controllers/authController'
import upload from './../services/filesStorageEngine'
import validationRules from '../middlewares/authValidator/rules'
import accessTokenValidator from '../middlewares/accessTokenValidator'
import refreshTokenValidator from '../middlewares/refreshTokenValidator'
import codesRequestValidator from '../middlewares/codesRequestValidator'
import cors from 'cors'
import ENV from '../ENV'
import commonController from '../controllers/commonController'
import userController from '../controllers/userController'
import codesController from '../controllers/codesController'

const router = Router()

const corsOptions = {
  origin: `${ENV.HOST}`,
  optionsSuccessStatus: 200,
  credentials: true
}

router.use(cors(corsOptions))

router.get(AuthEndPoints.UPDATE_TOKENS_PAIR, refreshTokenValidator, authController.updateTokensPair)
router.post(AuthEndPoints.REGISTRATION, validationRules.registration, authController.registration)
router.post(AuthEndPoints.LOGIN, authController.login)
router.post(AuthEndPoints.PROVIDER_LOGIN, authController.signInWithProvider)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, authController.sendConfirmationLink)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION, authController.confirmEmail)

router.get(UserEndPoints.GET_USER_DATA, accessTokenValidator, userController.getUserData)
router.post(UserEndPoints.UPDATE_USER_DATA, upload.single('file'), userController.updateUserData)
router.post(UserEndPoints.UPDATE_USER_SETTINGS, userController.updateUserSettings)

router.get(CommonEndPoints.COMMON_IMAGES, commonController.imagesHandler)
router.get(CommonEndPoints.GET_FILES, commonController.showFiles)
router.post(CommonEndPoints.RESET_PASSWORD, commonController.resetPassword)

router.post(
  CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY,
  codesRequestValidator,
  codesController.emailPasswordRecovery
)
router.post(CodesEndPoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY, codesController.validateEmailCodePasswordRecovery)

export default router
