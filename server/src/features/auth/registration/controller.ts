import bcrypt from 'bcryptjs'
import { AuthRegistrationPayloadType, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import type { Request, Response } from 'express'
import { createUser } from 'features/user'
import { throwHTTPError } from 'shared-lib'

import { Message } from './lib'

export const registration = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: AuthRegistrationPayloadType = req.body

    const userNameCandidate = await UserModel.findOne({ 'public.username': username })

    if (userNameCandidate) {
      return throwHTTPError(StatusEnum.BadRequest, res, Message.UserWithCurrentNameAlreadyExist)
    }

    const emailCandidate = await UserModel.findOne({ 'public.email': email })

    if (emailCandidate) {
      return throwHTTPError(StatusEnum.BadRequest, res, Message.UserWithCurrentEmailAlreadyExist)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    const user = createUser({ email, username, hashedPassword })

    await user.save()

    // TODO Добавить сюда отправку письма на почту пользователя

    return res.json({ message: Message.RegistrationSuccess })
  } catch {
    throwHTTPError(StatusEnum.Server, res, Message.FailedRegistration)
  }
}
