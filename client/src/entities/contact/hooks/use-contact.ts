import { useMemo } from 'react'

import { useTypedSelector } from 'src/shared/lib'

export const useContact = () => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const contactInvitationsQuantity = useMemo(
    () => contacts.filter((contact) => contact.interaction === 'invite-received').length,
    [contacts]
  )
  const getContact = (id: string) => contacts.find((contact) => contact.id === id)
  const isContactExist = (id: string) => Boolean(getContact(id))
  const getContacts = (ids: string[]) => contacts.filter((contact) => ids.includes(contact.id))

  return { contacts, contactInvitationsQuantity, isContactExist, getContact, getContacts }
}
