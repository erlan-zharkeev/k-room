import bcrypt from 'bcryptjs'

import { type IAuthRegistrationPayload, type ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { EMAIL_CONFIRMATION_LINK_LIFE, generateToken } from 'src/features/auth/shared'
import { sendEmailConfirmationEmail } from 'src/features/email'
import { createUser, isUserExist } from 'src/features/user'

import { type AppResponseType, type IAppRequest, SERVER_ENV } from 'src/shared/config'
import { getLocalizedText, getRequestLanguage, throwHTTPError } from 'src/shared/lib'

import { REGISTRATION_I18N, REGISTRATION_RESEND_INTERVAL_MINUTES } from './config'
import { getUserExistMessage } from './lib'

export const registrationController = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const language = getRequestLanguage(req.headers)
  const basicError = getLocalizedText(REGISTRATION_I18N.failedRegistration, language)

  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

    const userExistState = await isUserExist({ username, email })

    if (userExistState.exists) {
      const userExistMessage = getUserExistMessage(userExistState.reason, language)
      const status = userExistState.reason === 'id' ? StatusEnum.Server : StatusEnum.BadRequest
      return throwHTTPError(status, res, userExistMessage)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await createUser({ email, username, hashedPassword })

    if (!user) {
      return throwHTTPError(StatusEnum.Server, res, basicError)
    }

    const confirmToken = generateToken(user.id, SERVER_ENV.emailConfirmSecret, EMAIL_CONFIRMATION_LINK_LIFE)

    await sendEmailConfirmationEmail({
      email,
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
        text: getLocalizedText(REGISTRATION_I18N.registrationSuccess, language),
        silent: false
      }
    }

    return res.json(response)
  } catch (error) {
    return throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
