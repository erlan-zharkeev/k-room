import { UserModel } from '../../../models/user.model'

export const getUsersByHasContactId = async (contactId: string) => await UserModel.find({ contacts: contactId })
