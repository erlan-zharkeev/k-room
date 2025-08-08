import bcrypt from 'bcryptjs'
import { AuthLoginPayloadType, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { Response } from 'express'
import { IRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { updateTokens } from '../~shared'
import { mapUserToDto, Message } from './lib'

export const login = async (req: IRequest, res: Response) => {
  try {
    const { email: inputEmail, password }: AuthLoginPayloadType = req.body

    const user = await UserModel.findOne({ 'public.email': inputEmail })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, Message.InvalidEmailOrPassword)
    }

    const isPasswordValid = bcrypt.compareSync(password, user.system.password)

    if (!isPasswordValid) {
      return throwHTTPError(StatusEnum.BadRequest, res, Message.InvalidEmailOrPassword)
    }

    if (!user.system.confirmed) {
      return throwHTTPError(StatusEnum.BadRequest, res, Message.EmailNotConfirmed)
    }

    await updateTokens(user.id.toString(), req, res)

    const data = mapUserToDto(user)

    return res.json({
      ...data,
      message: Message.Success,
      silent: true
    })
  } catch {
    throwHTTPError(StatusEnum.Server, res, Message.Failed)
  }
}
