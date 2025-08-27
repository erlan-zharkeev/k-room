import bcrypt from 'bcryptjs'
import { type IAuthRegistrationPayload, StatusEnum } from 'common-types'
import { createUser } from 'features/user'
import type { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { isUserExist } from '../~shared'
import { MESSAGE } from './config'

export const registration = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const { username, email, password }: IAuthRegistrationPayload = req.body

    await isUserExist({ username, email }, res)

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
