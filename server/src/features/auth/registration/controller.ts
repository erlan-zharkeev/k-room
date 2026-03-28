import bcrypt from 'bcryptjs'

import { type IAuthRegistrationPayload, type ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { sendEmailConfirmationEmail } from 'src/features/email'
import { createUser, isUserExist } from 'src/features/user'

import { type AppResponseType, ENV, type IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { generateToken } from './../shared'
import { I18N_REGISTRATION_MESSAGE } from '.'

export const registration = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const language = req.language

  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

    await isUserExist({ username, email }, res)

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await createUser({ email, username, hashedPassword })

    if (!user) {
      return throwHTTPError(
        StatusEnum.Server,
        res,
        getLocalizedText(I18N_REGISTRATION_MESSAGE.failedRegistration, language)
      )
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
        text: getLocalizedText(I18N_REGISTRATION_MESSAGE.registrationSuccess, language),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_REGISTRATION_MESSAGE.failedRegistration, language))
  }
}
