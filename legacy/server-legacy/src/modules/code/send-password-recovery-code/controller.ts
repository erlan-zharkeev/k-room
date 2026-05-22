import { randomInt } from 'node:crypto'

import { SendPasswordRecoveryCodeResponse, REQ_STATUS } from 'common'

import { sendPasswordRecoveryEmail } from 'src/modules/email'
import { USER_I18N } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { AppResponse, AppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { CodeModel } from '../code.model'

import { CODE_LIFE_MS, RESEND_CODE_INTERVAL } from './config/constants'
import { SEND_PASSWORD_RECOVERY_CODE_I18N } from './config/i18n'

const buildPasswordRecoveryCode = () => String(randomInt(100000, 1000000))

export const sendPasswordRecoveryCodeController = async (
  req: AppRequest,
  res: AppResponse<SendPasswordRecoveryCodeResponse>
) => {
  const { language } = req
  const basicError = localizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.sendFailed, language)

  try {
    const { email } = req.body as { email: string }

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    const now = Date.now()
    const existingCode = await CodeModel.findById(user.id)

    if (existingCode?.nextRequestPossibleAt && existingCode.nextRequestPossibleAt > now) {
      return res.json({
        payload: {
          nextTimeRequest: existingCode.nextRequestPossibleAt
        },
        message: {
          text: localizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.tooManyRequests, language),
          silent: false
        }
      })
    }

    const code = buildPasswordRecoveryCode()
    const nextTimeRequest = now + RESEND_CODE_INTERVAL

    await CodeModel.updateOne(
      { _id: user.id },
      {
        $set: {
          'codes.passwordRecovery.email.value': code,
          'codes.passwordRecovery.email.expiresAt': now + CODE_LIFE_MS,
          'codes.passwordRecovery.query.value': '',
          'codes.passwordRecovery.query.expiresAt': 0,
          nextRequestPossibleAt: nextTimeRequest
        }
      },
      { upsert: true }
    )

    await sendPasswordRecoveryEmail({
      email,
      code,
      language,
      username: user.public.username
    })

    return res.json({
      payload: {
        nextTimeRequest,
        ...(SERVER_ENV.isDev ? { debugCode: code } : {})
      },
      message: {
        text: localizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.codeSent, language),
        silent: false
      }
    })
  } catch (error) {
    return throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
