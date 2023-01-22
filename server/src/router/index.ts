import { Router } from 'express'
import { AuthEndPoints, CommonEndPoints, SystemEndPoints } from '../../../types'
import authController from '../controllers/authController'
import upload from '../filesStorageEngine'
import validationRules from '../middlewares/authValidator/rules'
import accessTokenValidator from '../middlewares/accessTokenValidator'
import refreshTokenValidator from '../middlewares/refreshTokenValidator'
import cors from 'cors'
import ENV from '../ENV'
import commonController from '../controllers/commonController'

const router = Router()

const corsOptions = {
  origin: `${ENV.HOST}`,
  optionsSuccessStatus: 200,
  credentials: true
}

router.use(cors(corsOptions))

router.post(AuthEndPoints.REGISTRATION, validationRules.registration, authController.registration)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, authController.sendConfirmationLink)
router.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION, authController.confirmEmail)
router.post(AuthEndPoints.LOGIN, authController.login)
router.post(AuthEndPoints.UPDATE_USER_DATA, upload.single('file'), authController.updateUserData)
router.get(AuthEndPoints.GET_FILES, authController.showFiles)
router.get(AuthEndPoints.GET_USER_DATA, accessTokenValidator, authController.getUserData)
router.get(AuthEndPoints.UPDATE_TOKENS_PAIR, refreshTokenValidator, authController.updateTokensPair)

router.post(SystemEndPoints.UPDATE_USER_SETTINGS, authController.updateUserSettings)

router.get(CommonEndPoints.COMMON_IMAGES, commonController.imagesHandler)

export default router
