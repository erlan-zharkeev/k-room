import bcrypt from 'bcryptjs'

import { type IAuthLoginPayload, ILoginResponse, StatusEnum } from 'common-types'

import { updateTokens } from 'features/auth'
import { MESSAGE } from 'features/auth/login/config'
import { mapUserToDto } from 'features/user'

import { UserModel } from 'entities/user'

import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const login = async (req: IAppRequest, res: AppResponseType<ILoginResponse>) => {
  try {
    const { email: inputEmail, password }: IAuthLoginPayload = req.body
    const user = await UserModel.findOne({ 'personal.email': inputEmail })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.invalidEmailOrPassword)
    }

    const isPasswordValid = bcrypt.compareSync(password, user.system.password)

    if (!isPasswordValid) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.invalidEmailOrPassword)
    }

    if (!user.system.confirmed) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.emailNotConfirmed)
    }

    await updateTokens(user.id, req, res)

    const response = {
      data: mapUserToDto(user),
      message: {
        text: SHARED_MESSAGE.success,
        silent: true
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failed)
  }
}
