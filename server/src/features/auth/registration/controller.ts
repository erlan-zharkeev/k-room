import bcrypt from 'bcryptjs'

import { IAuthRegistrationPayload, ISendConfirmationLinkResponse, REQ_STATUS } from 'common'

import { EMAIL_CONFIRMATION_LINK_LIFE, generateToken } from 'src/features/auth'
import { sendEmailConfirmationEmail } from 'src/features/email'
import { createUser, isUserExist } from 'src/features/user'

import { AppResponseType, IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { REGISTRATION_I18N, REGISTRATION_RESEND_INTERVAL_MINUTES } from './config'
import { getUserExistMessage } from './lib'

export const registrationController = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const { language } = req
  const basicError = localizedText(REGISTRATION_I18N.failedRegistration, language)

  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

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
