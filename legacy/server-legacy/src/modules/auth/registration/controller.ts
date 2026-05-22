import bcrypt from 'bcryptjs'
import { AuthRegistrationPayload, SendConfirmationLinkResponse, REQ_STATUS } from 'common'

import { sendEmailConfirmationEmail } from 'src/modules/email'
import { createUser, isUserExist } from 'src/modules/user'

import { AppResponse, AppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { EMAIL_CONFIRMATION_LINK_LIFE } from '../shared/config/constants'
import { generateToken } from '../shared/lib/generate-token'

import { REGISTRATION_RESEND_INTERVAL_MINUTES } from './config/constants'
import { REGISTRATION_I18N } from './config/i18n'
import { getUserExistMessage } from './lib/get-user-exist-message'

export const registrationController = async (req: AppRequest, res: AppResponse<SendConfirmationLinkResponse>) => {
  const { language } = req
  const basicError = localizedText(REGISTRATION_I18N.failedRegistration, language)

  try {
    const { username, email, password }: AuthRegistrationPayload = req.body

    const userExistState = await isUserExist({ username, email })

    if (userExistState.exists) {
      const userExistMessage = getUserExistMessage(userExistState.reason, language)
      const status = userExistState.reason === 'id' ? REQ_STATUS.server : REQ_STATUS.badRequest
      return throwHTTPError(status, res, userExistMessage)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await createUser({ email, username, hashedPassword })

    if (!user) {
      return throwHTTPError(REQ_STATUS.server, res, basicError)
    }

    const confirmToken = generateToken(user.id, SERVER_ENV.emailConfirmSecret, EMAIL_CONFIRMATION_LINK_LIFE)

    await sendEmailConfirmationEmail({
      email,
      language,
      token: confirmToken,
      username
    })

    const nextRequestTime = Date.now() + REGISTRATION_RESEND_INTERVAL_MINUTES

    const response = {
      payload: {
        email,
        attempts: user.system.confirmAttempts,
        nextRequestTime
      },
      message: {
        text: localizedText(REGISTRATION_I18N.registrationSuccess, language),
        silent: false
      }
    }

    return res.json(response)
  } catch (error) {
    return throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
