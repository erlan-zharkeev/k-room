import mongoose from 'mongoose'

import { StatusEnum } from 'common'

import { UserModel } from 'src/entities/user'

import { AppResponseType } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { USER_I18N } from './../config'

export const isUserExist = async <T>(
  { username, email, id }: { username: string; email: string; id?: mongoose.Types.ObjectId },
  res?: AppResponseType<T>
) => {
  let userExist = false

  const userNameCandidate = await UserModel.findOne({ 'public.username': username })

  if (userNameCandidate) {
    userExist = true
    if (res) throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userWithCurrentNameAlreadyExist))
  }

  const emailCandidate = await UserModel.findOne({ 'personal.email': email })

  if (emailCandidate) {
    userExist = true
    if (res) throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userWithCurrentEmailAlreadyExist))
  }

  if (id) {
    const idCandidate = await UserModel.findById(id)
    if (idCandidate) {
      userExist = true
      if (res) throwHTTPError(StatusEnum.Server, res, getLocalizedText(USER_I18N.userWithCurrentIdAlreadyExist))
    }
  }

  return userExist
}
