import type { InteractionType } from 'common'

import { UserModel } from 'entities/user'

export const createContactInteraction = async (docId: string, contactId: string, interaction: InteractionType) => {
  return UserModel.findOneAndUpdate(
    { _id: docId },
    { $set: { [`personal.contacts.${contactId}`]: { id: contactId, interaction, updatedAt: Date.now() } } },
    { new: true }
  )
}
