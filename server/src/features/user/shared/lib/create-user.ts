import mongoose from 'mongoose'

import { ProviderType } from 'common'

import { getInitialInfoNotificationMap } from 'src/features/info-notification'

import { InfoNotificationStateModel } from 'src/entities/info-notification-state'
import { UserModel } from 'src/entities/user'

import { isUserExist } from './is-user-exist'

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
  if (!id) return null
  const idCandidate = new mongoose.Types.ObjectId(id)
  const createdAt = Date.now()

  const userExistState = await isUserExist({ id: idCandidate, username, email })
  if (userExistState.exists) return null
  const infoNotifications = await getInitialInfoNotificationMap(createdAt)

  const user = await new UserModel({
    _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId(),
    public: { username },
    personal: { email },
    system: { role: 'user', password: hashedPassword, provider, device: {} }
  }).save()

  await new InfoNotificationStateModel({
    userId: user._id,
    infoNotifications
  }).save()

  return user
}
