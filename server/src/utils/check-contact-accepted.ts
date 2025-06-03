import { UserModel } from '../models'

export const checkContactsAccepted = async (selfId: string, contactIds: string[]): Promise<boolean> => {
  try {
    const [self, contacts] = await Promise.all([
      UserModel.findById(selfId, { contacts: 1 }),
      UserModel.find({ _id: { $in: contactIds } }, { contacts: 1 })
    ])

    if (!self || contacts.length !== contactIds.length) return false

    return contactIds.every((contactId) => {
      const selfContact = self.contacts?.[contactId]
      const user = contacts.find((contact) => contact._id.toString() === contactId)
      const userContact = user?.contacts?.[selfId]

      return selfContact?.interaction === 'invite-accepted' && userContact?.interaction === 'invite-accepted'
    })
  } catch (error) {
    console.error('Error checking contacts:', error)
    return false
  }
}
