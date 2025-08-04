import type { InteractionType } from 'common-types'
import { UserModel } from 'entities/user'

export const createContactInteraction = async (docId: string, contactId: string, interaction: InteractionType) => {
  return UserModel.findOneAndUpdate(
    { _id: docId },
    { $set: { [`contacts.${contactId}`]: { id: contactId, interaction, updatedAt: Date.now() } } },
    { new: true }
  )
}
