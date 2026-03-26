import { ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { generateToken } from 'features/auth'
import { MESSAGE } from 'features/auth/send-confirmation-link/config'
import { sendEmailConfirmationEmail } from 'features/email'
import { USER_MESSAGE } from 'features/user'

import { UserModel } from 'entities/user'

import { AppResponseType, ENV, IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const sendConfirmationLink = async (req: IAppRequest, res: AppResponseType<ISendConfirmationLinkResponse>) => {
  const language = req.language

  try {
    const { email } = req.body

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    if (user.system.confirmed) {
      const response = {
        payload: {
          email: user.personal.email,
          attempts: user.system.confirmAttempts,
          nextRequestTime: String(Date.now())
        },
        message: {
          text: getLocalizedText(MESSAGE.emailAlreadyConfirmed, language),
          silent: false
        }
      }

      return res.json(response)
    }

    if (user.system.confirmAttempts <= 0) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.noConfirmationAttemptsLeft, language))
    }

    const confirmToken = generateToken(
      user.id,
      ENV.EMAIL_CONFIRM_SECRET,
      Number(ENV.EMAIL_CONFIRMATION_LINK_LIFE)
    )

    await sendEmailConfirmationEmail({
      email: user.personal.email,
      token: confirmToken,
      username: user.public.username
    })

    const nextAttempts = Math.max(user.system.confirmAttempts - 1, 0)
    user.set('system.confirmAttempts', nextAttempts)
    await user.save()

    const nextRequestTime = String(
      Date.now() + Number(ENV.REGISTRATION_RESEND_INTERVAL_MINUTES) * 60 * 1000
    )

    const response = {
      payload: {
        email: user.personal.email,
        attempts: nextAttempts,
        nextRequestTime
      },
      message: {
        text: getLocalizedText(MESSAGE.confirmationLinkSent, language),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failedSendEmailConfirmationLink, language))
  }
}
