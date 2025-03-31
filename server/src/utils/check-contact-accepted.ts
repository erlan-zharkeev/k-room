import { UserModel } from '../models'

export const checkContactsAccepted = async (selfId: string, contactId: string): Promise<boolean> => {
  try {
    const [self, user] = await Promise.all([
      UserModel.findById(selfId, { contacts: 1 }),
      UserModel.findById(contactId, { contacts: 1 })
    ])

    if (!self || !user) return false

    const selfContact = self.contacts?.[contactId]
    const userContact = user.contacts?.[selfId]

    return selfContact?.interaction === 'invite-accepted' && userContact?.interaction === 'invite-accepted'
  } catch (error) {
    console.error('Error checking contacts:', error)
    return false
  }
}
