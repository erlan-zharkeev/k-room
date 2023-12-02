import { UserModel } from '../../../models'

export const getUsersByHasContactId = async (contactId: string) => await UserModel.find({ contacts: contactId })
