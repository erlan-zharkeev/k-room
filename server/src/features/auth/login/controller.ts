import bcrypt from 'bcryptjs'
import { UserModel } from 'src/entities/user'
import { I18N_LOGIN_MESSAGE, updateTokens } from 'src/features/auth'
import { mapUserToDto } from 'src/features/user'
import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { type IAuthLoginPayload, ILoginResponse, StatusEnum } from 'common'

export const login = async (req: IAppRequest, res: AppResponseType<ILoginResponse>) => {
  const language = req.language

  try {
    const { email: inputEmail, password }: IAuthLoginPayload = req.body
    const user = await UserModel.findOne({ 'personal.email': inputEmail })

    if (!user) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(I18N_LOGIN_MESSAGE.invalidEmailOrPassword, language)
      )
    }

    const isPasswordValid = bcrypt.compareSync(password, user.system.password)

    if (!isPasswordValid) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(I18N_LOGIN_MESSAGE.invalidEmailOrPassword, language)
      )
    }

    if (!user.system.confirmed) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(I18N_LOGIN_MESSAGE.emailNotConfirmed, language)
      )
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
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_LOGIN_MESSAGE.failed, language))
  }
}
