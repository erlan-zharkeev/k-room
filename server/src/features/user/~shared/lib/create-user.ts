import { ProviderType } from 'common-types'
import { UserModel } from 'entities/user'
import { isUserExist } from 'features/auth'
import mongoose from 'mongoose'
import { log } from 'shared-lib'

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

    await isUserExist({ id: idCandidate, username, email })

    user = await new UserModel({
      _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId(),
      public: { username },
      personal: { email, infoNotifications: { 1: 'unread' } },
      system: { role: 'user', password: hashedPassword, provider, device: {} }
    }).save()
  } catch {
    log.error('-New user creating failed')
  }
  return user
}
