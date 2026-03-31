import bcrypt from 'bcryptjs'

import { type IAuthRegistrationPayload, type ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { EMAIL_CONFIRMATION_LINK_LIFE, generateToken } from 'src/features/auth/shared'
import { sendEmailConfirmationEmail } from 'src/features/email'
import { createUser, isUserExist } from 'src/features/user'

import { type AppResponseType, ENV, type IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { REGISTRATION_RESEND_INTERVAL_MINUTES } from './config'
import { REGISTRATION_I18N } from './index'

export const registrationController = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const language = req.language

  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

    await isUserExist({ username, email }, res)

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await createUser({ email, username, hashedPassword })

    if (!user) {
      return throwHTTPError(StatusEnum.Server, res, getLocalizedText(REGISTRATION_I18N.failedRegistration, language))
    }

    const confirmToken = generateToken(user.id, ENV.EMAIL_CONFIRM_SECRET, EMAIL_CONFIRMATION_LINK_LIFE)

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
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(REGISTRATION_I18N.failedRegistration, language))
  }
}
