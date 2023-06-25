import { UserModel } from '../../../models/user.model'

export const getUserById = async (userId: string) => await UserModel.findOne({ _id: userId })
