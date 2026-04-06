import bcrypt from 'bcryptjs'

import { IAuthLoginPayload, ILoginResponse, REQ_STATUS } from 'common'

import { mapUserToDto } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { updateTokens } from './../shared'
import { LOGIN_I18N } from './config'

export const loginController = async (req: IAppRequest, res: AppResponseType<ILoginResponse>) => {
  const { language } = req
  const basicError = localizedText(LOGIN_I18N.failed, language)

  try {
    const { email: inputEmail, password }: IAuthLoginPayload = req.body
    const user = await UserModel.findOne({ 'personal.email': inputEmail })

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(LOGIN_I18N.invalidEmailOrPassword, language))
    }

    const isPasswordValid = bcrypt.compareSync(password, user.system.password)

    if (!isPasswordValid) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(LOGIN_I18N.invalidEmailOrPassword, language))
    }

    if (!user.system.confirmed) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(LOGIN_I18N.emailNotConfirmed, language))
    }

    await updateTokens(user.id, req, res)

    const response = {
      payload: mapUserToDto(user),
      message: {
        text: localizedText(SHARED_I18N.success, language),
        silent: true
      }
    }

    return res.json(response)
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
