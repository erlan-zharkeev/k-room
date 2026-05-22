import { SendConfirmationLinkResponse, REQ_STATUS } from 'common'

import { sendEmailConfirmationEmail } from 'src/modules/email'
import { USER_I18N } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { AppResponse, AppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { EMAIL_CONFIRMATION_LINK_LIFE } from '../shared/config/constants'
import { generateToken } from '../shared/lib/generate-token'

import { SEND_CONFIRMATION_LINK_INTERVAL_MINUTES } from './config/constants'
import { SEND_CONFIRMATION_LINK_I18N } from './config/i18n'

export const sendConfirmationLinkController = async (
  req: AppRequest,
  res: AppResponse<SendConfirmationLinkResponse>
) => {
  const { language } = req
  const basicError = localizedText(SEND_CONFIRMATION_LINK_I18N.failedSendEmailConfirmationLink, language)

  try {
    const { email } = req.body

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    if (user.system.confirmed) {
      const response = {
        payload: {
          email: user.personal.email,
          attempts: user.system.confirmAttempts,
          nextRequestTime: Date.now()
        },
        message: {
          text: localizedText(SEND_CONFIRMATION_LINK_I18N.emailAlreadyConfirmed, language),
          silent: false
        }
      }

      return res.json(response)
    }

    if (user.system.confirmAttempts <= 0) {
      return throwHTTPError(
        REQ_STATUS.badRequest,
        res,
        localizedText(SEND_CONFIRMATION_LINK_I18N.noConfirmationAttemptsLeft, language)
      )
    }

    const confirmToken = generateToken(user.id, SERVER_ENV.emailConfirmSecret, EMAIL_CONFIRMATION_LINK_LIFE)

    await sendEmailConfirmationEmail({
      email: user.personal.email,
      language,
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
        text: localizedText(SEND_CONFIRMATION_LINK_I18N.confirmationLinkSent, language),
        silent: false
      }
    }

    return res.json(response)
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
