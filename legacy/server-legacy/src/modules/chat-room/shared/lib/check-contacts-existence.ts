import { UserModel } from 'src/modules/user'

export const checkContactsExistence = async (selfId: string, contactIds: string[]): Promise<boolean> => {
  const [self, contacts] = await Promise.all([
    UserModel.findById(selfId, { 'personal.contacts': 1 }),
    UserModel.find({ _id: { $in: contactIds } }, { 'personal.contacts': 1 })
  ])

  if (!self || contacts.length !== contactIds.length) return false

  return contactIds.every((contactId) => {
    const selfContact = self.personal.contacts?.[contactId]
    const user = contacts.find((contact) => contact._id.toString() === contactId)
    const userContact = user?.personal.contacts?.[selfId]
    return selfContact?.interaction === 'invite-accepted' && userContact?.interaction === 'invite-accepted'
  })
}
