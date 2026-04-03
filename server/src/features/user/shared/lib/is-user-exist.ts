import mongoose from 'mongoose'

import { UserModel } from 'src/entities/user'

import { UserExistResultType } from './types'

export const isUserExist = async ({
  username,
  email,
  id
}: {
  username: string
  email: string
  id?: mongoose.Types.ObjectId
}): Promise<UserExistResultType> => {
  let result: UserExistResultType = {
    exists: false,
    reason: null
  }

  const userNameCandidate = await UserModel.findOne({ 'public.username': username })

  if (userNameCandidate) {
    result = {
      exists: true,
      reason: 'username'
    }
  }

  const emailCandidate = await UserModel.findOne({ 'personal.email': email })

  if (emailCandidate) {
    result = {
      exists: true,
      reason: 'email'
    }
  }

  if (id) {
    const idCandidate = await UserModel.findById(id)
    if (idCandidate) {
      result = {
        exists: true,
        reason: 'id'
      }
    }
  }

  return result
}
