import { useTypedSelector } from 'src/shared/lib'

export const useContact = () => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const invitationsQuantity = contacts.filter((contact) => contact.interactionType === 'invite-received').length

  return { contacts, invitationsQuantity }
}
