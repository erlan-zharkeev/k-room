import bcrypt from 'bcryptjs'

import { type IAuthLoginPayload, ILoginResponse, StatusEnum } from 'common'

import { updateTokens } from 'features/auth'
import { mapUserToDto } from 'features/user'

import { UserModel } from 'entities/user'

import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const login = async (req: IAppRequest, res: AppResponseType<ILoginResponse>) => {
  const language = req.language

  try {
    const { email: inputEmail, password }: IAuthLoginPayload = req.body
    const user = await UserModel.findOne({ 'personal.email': inputEmail })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.invalidEmailOrPassword, language))
    }

    const isPasswordValid = bcrypt.compareSync(password, user.system.password)

    if (!isPasswordValid) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.invalidEmailOrPassword, language))
    }

    if (!user.system.confirmed) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.emailNotConfirmed, language))
    }

    await updateTokens(user.id, req, res)

    const response = {
      payload: mapUserToDto(user),
      message: {
        text: getLocalizedText(SHARED_MESSAGE.success, language),
        silent: true
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failed, language))
  }
}
