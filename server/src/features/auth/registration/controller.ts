import bcrypt from 'bcryptjs'
import { type AuthRegistrationPayloadType, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { createUser } from 'features/user'
import type { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const registration = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const { username, email, password }: AuthRegistrationPayloadType = req.body

    const userNameCandidate = await UserModel.findOne({ 'public.username': username })

    if (userNameCandidate) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.userWithCurrentNameAlreadyExist)
    }

    const emailCandidate = await UserModel.findOne({ 'public.email': email })

    if (emailCandidate) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.userWithCurrentEmailAlreadyExist)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await createUser({ email, username, hashedPassword })

    // TODO Добавить сюда отправку письма на почту пользователя

    const response = {
      data: null,
      message: {
        text: MESSAGE.registrationSuccess,
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failedRegistration)
  }
}
