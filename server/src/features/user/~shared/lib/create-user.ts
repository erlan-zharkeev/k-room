import mongoose from 'mongoose'

import { ProviderType } from 'common'

import { isUserExist } from 'features/auth'

import { UserModel } from 'entities/user'

import { log, serverCaptureSentryException } from 'shared-lib'

export const createUser = async ({
  id,
  email,
  username,
  hashedPassword,
  provider = 'app'
}: {
  id?: mongoose.Types.ObjectId
  email: string
  username: string
  hashedPassword: string
  provider?: ProviderType
}) => {
  let user = null
  try {
    const idCandidate = new mongoose.Types.ObjectId(id)

    const userAlreadyExists = await isUserExist({ id: idCandidate, username, email })
    if (userAlreadyExists) {
      log.success('-New user creating skipped: user already exists')
      return null
    }

    user = await new UserModel({
      _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId(),
      public: { username },
      personal: { email, infoNotifications: { 1: 'unread' } },
      system: { role: 'user', password: hashedPassword, provider, device: {} }
    }).save()
  } catch (error) {
    log.error('-New user creating failed')
    log.error(String(error))
    serverCaptureSentryException(error)
  }
  return user
}
