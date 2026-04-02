import { randomInt } from 'node:crypto'

import { ISendPasswordRecoveryCodeResponse, StatusEnum } from 'common'

import { sendPasswordRecoveryEmail } from 'src/features/email'
import { USER_I18N } from 'src/features/user'

import { CodeModel } from 'src/entities/code'
import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SERVER_ENV } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { CODE_LIFE_MS, RESEND_CODE_INTERVAL, SEND_PASSWORD_RECOVERY_CODE_I18N } from './config'

const buildPasswordRecoveryCode = () => String(randomInt(100000, 1000000))

export const sendPasswordRecoveryCodeController = async (
  req: IAppRequest,
  res: AppResponseType<ISendPasswordRecoveryCodeResponse>
) => {
  const { language } = req
  const basicError = getLocalizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.sendFailed, language)

  try {
    const { email } = req.body as { email: string }

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userNotFound, language))
    }

    const now = Date.now()
    const existingCode = await CodeModel.findById(user.id)

    if (existingCode?.nextRequestPossibleAt && existingCode.nextRequestPossibleAt > now) {
      return res.json({
        payload: {
          nextTimeRequest: existingCode.nextRequestPossibleAt
        },
        message: {
          text: getLocalizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.tooManyRequests, language),
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
      username: user.public.username
    })

    return res.json({
      payload: {
        nextTimeRequest,
        ...(SERVER_ENV.isDev ? { debugCode: code } : {})
      },
      message: {
        text: getLocalizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.codeSent, language),
        silent: false
      }
    })
  } catch (error) {
    return throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
