import { randomInt } from 'node:crypto'

import { ISendPasswordRecoveryCodeResponse, StatusEnum } from 'common'

import { MESSAGE } from 'features/code/send-password-recovery-code/config'
import { sendPasswordRecoveryEmail } from 'features/email'
import { USER_MESSAGE } from 'features/user'

import { CodeModel } from 'entities/code'
import { UserModel } from 'entities/user'

import { AppResponseType, ENV, IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

const CODE_LIFE_MS = 1000 * 60 * 15
const buildPasswordRecoveryCode = () => String(randomInt(100000, 1000000))

export const sendPasswordRecoveryCode = async (
  req: IAppRequest,
  res: AppResponseType<ISendPasswordRecoveryCodeResponse>
) => {
  const language = req.language

  try {
    const { email } = req.body as { email: string }

    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    const now = Date.now()
    const existingCode = await CodeModel.findById(user.id)

    if (existingCode?.nextRequestPossibleAt && existingCode.nextRequestPossibleAt > now) {
      return res.json({
        payload: {
          nextTimeRequest: existingCode.nextRequestPossibleAt
        },
        message: {
          text: getLocalizedText(MESSAGE.tooManyRequests, language),
          silent: false
        }
      })
    }

    const code = buildPasswordRecoveryCode()
    const nextTimeRequest = now + Number(ENV.REGISTRATION_RESEND_INTERVAL_MINUTES) * 60 * 1000

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
        ...(ENV.IS_DEV ? { debugCode: code } : {})
      },
      message: {
        text: getLocalizedText(MESSAGE.codeSent, language),
        silent: false
      }
    })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.sendFailed, language))
  }
}
