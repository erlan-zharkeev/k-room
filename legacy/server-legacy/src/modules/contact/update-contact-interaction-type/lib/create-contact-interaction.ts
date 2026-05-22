import { Interaction } from 'common'

import { UserModel } from 'src/modules/user'

export const createContactInteraction = async (docId: string, contactId: string, interaction: Interaction) => {
  return UserModel.findOneAndUpdate(
    { _id: docId },
    { $set: { [`personal.contacts.${contactId}`]: { id: contactId, interaction, updatedAt: Date.now() } } },
    { new: true }
  )
}
