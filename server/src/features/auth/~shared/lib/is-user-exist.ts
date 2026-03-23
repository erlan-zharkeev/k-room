import mongoose from 'mongoose'

import { StatusEnum } from 'common-types'

import { USER_MESSAGE } from 'features/user'

import { UserModel } from 'entities/user'

import { AppResponseType } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const isUserExist = async <T>(
  { username, email, id }: { username: string; email: string; id?: mongoose.Types.ObjectId },
  res?: AppResponseType<T>
) => {
  let userExist = false

  const userNameCandidate = await UserModel.findOne({ 'public.username': username })

  if (userNameCandidate) {
    userExist = true
    if (res) throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userWithCurrentNameAlreadyExist)
  }

  const emailCandidate = await UserModel.findOne({ 'personal.email': email })

  if (emailCandidate) {
    userExist = true
    if (res) throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userWithCurrentEmailAlreadyExist)
  }

  if (id) {
    const idCandidate = await UserModel.findById(id)
    if (idCandidate) {
      userExist = true
      if (res) throwHTTPError(StatusEnum.Server, res, USER_MESSAGE.userWithCurrentIdAlreadyExist)
    }
  }

  return userExist
}
