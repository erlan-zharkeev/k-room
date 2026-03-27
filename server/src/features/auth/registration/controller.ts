import bcrypt from 'bcryptjs'

import { type IAuthRegistrationPayload, ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { generateToken, isUserExist } from 'features/auth'
import { MESSAGE } from 'features/auth/registration'
import { sendEmailConfirmationEmail } from 'features/email'
import { createUser } from 'features/user'

import { type AppResponseType, ENV, type IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const registration = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const language = req.language

  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

    await isUserExist({ username, email }, res)

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await createUser({ email, username, hashedPassword })

    if (!user) {
      return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failedRegistration, language))
    }

    const confirmToken = generateToken(user.id, ENV.EMAIL_CONFIRM_SECRET, Number(ENV.EMAIL_CONFIRMATION_LINK_LIFE))

    await sendEmailConfirmationEmail({
      email,
      token: confirmToken,
      username
    })

    const nextRequestTime = Date.now() + Number(ENV.REGISTRATION_RESEND_INTERVAL_MINUTES) * 60 * 1000

    const response = {
      payload: {
        email,
        attempts: user.system.confirmAttempts,
        nextRequestTime
      },
      message: {
        text: getLocalizedText(MESSAGE.registrationSuccess, language),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failedRegistration, language))
  }
}
