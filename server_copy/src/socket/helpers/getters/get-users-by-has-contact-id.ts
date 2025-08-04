import { UserModel } from 'entities/user'

export const getUsersByHasContactId = async (contactId: string) => await UserModel.find({ contacts: contactId })
