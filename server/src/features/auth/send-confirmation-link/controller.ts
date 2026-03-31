import { ISendConfirmationLinkResponse, StatusEnum } from 'common'

import { EMAIL_CONFIRMATION_LINK_LIFE, generateToken } from 'src/features/auth/shared'
import { sendEmailConfirmationEmail } from 'src/features/email'
import { USER_I18N } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, ENV, IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { SEND_CONFIRMATION_LINK_I18N,SEND_CONFIRMATION_LINK_INTERVAL_MINUTES } from './config'

export const sendConfirmationLinkController = async (
  req: IAppRequest,
  res: AppResponseType<ISendConfirmationLinkResponse>
) => {
  const language = req.language

  try {
    const { email } = req.body

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userNotFound, language))
    }

    if (user.system.confirmed) {
      const response = {
        payload: {
          email: user.personal.email,
          attempts: user.system.confirmAttempts,
          nextRequestTime: Date.now()
        },
        message: {
          text: getLocalizedText(SEND_CONFIRMATION_LINK_I18N.emailAlreadyConfirmed, language),
          silent: false
        }
      }

      return res.json(response)
    }

    if (user.system.confirmAttempts <= 0) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(SEND_CONFIRMATION_LINK_I18N.noConfirmationAttemptsLeft, language)
      )
    }

    const confirmToken = generateToken(user.id, ENV.EMAIL_CONFIRM_SECRET, EMAIL_CONFIRMATION_LINK_LIFE)

    await sendEmailConfirmationEmail({
      email: user.personal.email,
      token: confirmToken,
      username: user.public.username
    })

    const nextAttempts = Math.max(user.system.confirmAttempts - 1, 0)
    user.set('system.confirmAttempts', nextAttempts)
    await user.save()

    const nextRequestTime = Date.now() + SEND_CONFIRMATION_LINK_INTERVAL_MINUTES

    const response = {
      payload: {
        email: user.personal.email,
        attempts: nextAttempts,
        nextRequestTime
      },
      message: {
        text: getLocalizedText(SEND_CONFIRMATION_LINK_I18N.confirmationLinkSent, language),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(
      StatusEnum.Server,
      res,
      getLocalizedText(SEND_CONFIRMATION_LINK_I18N.failedSendEmailConfirmationLink, language)
    )
  }
}
