import { InteractionType } from 'common'

import { UserModel } from 'src/modules/user'

export const setContactInteraction = async (docId: string, contactId: string, interaction: InteractionType) => {
  return UserModel.findOneAndUpdate(
    { _id: docId, [`personal.contacts.${contactId}`]: { $exists: true } },
    {
      $set: { [`personal.contacts.${contactId}.interaction`]: interaction, updatedAt: Date.now() }
    },
    { new: true }
  )
}
