import { ProviderType } from 'common-types'
import { UserModel } from 'entities/user'
import mongoose, { FilterQuery } from 'mongoose'

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
    const orConditions: FilterQuery<unknown>[] = [{ 'public.email': email }, { 'public.username': username }]

    if (id) {
      orConditions.push({ _id: new mongoose.Types.ObjectId(id) })
    }

    const exists = await UserModel.exists({ $or: orConditions })

    if (exists) {
      throw new Error('User with same id, email, or username already exists')
    }

    user = await new UserModel({
      _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId(),
      public: { email, username },
      personal: { role: 'user' },
      system: { password: hashedPassword, provider }
    }).save()
  } catch {
    //
  }
  return user
}
