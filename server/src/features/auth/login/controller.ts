import bcrypt from 'bcryptjs'
import { type AuthLoginPayloadType, ILoginResponse, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { mapUserToDto } from 'features/user'
import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { updateTokens } from '../~shared'
import { MESSAGE } from './config'

export const login = async (req: IAppRequest, res: AppResponseType<ILoginResponse>) => {
  try {
    const { email: inputEmail, password }: AuthLoginPayloadType = req.body
    const user = await UserModel.findOne({ 'public.email': inputEmail })

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
