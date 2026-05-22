import { Provider } from 'common'
import mongoose from 'mongoose'

import { UserModel } from '../../user.model'

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
  provider?: Provider
}) => {
  if (!id) return null
  const idCandidate = new mongoose.Types.ObjectId(id)

  const userExistState = await isUserExist({ id: idCandidate, username, email })
  if (userExistState.exists) return null

  const user = await new UserModel({
    _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId(),
    public: { username },
    personal: { email },
    system: { role: 'user', password: hashedPassword, provider, device: {} }
  }).save()

  return user
}
