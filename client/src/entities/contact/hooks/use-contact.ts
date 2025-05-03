import { useMemo } from 'react'

import { useTypedSelector } from 'src/shared/lib'

export const useContact = () => {
  const { contacts } = useTypedSelector((state) => state.contacts)

  const invitationsQuantity = useMemo(() => {
    return contacts.filter((contact) => contact.interaction === 'invite-received').length
  }, [contacts])

  const isContactExistById = (id: string) => Boolean(contacts.find((contact) => contact.id === id))

  return { contacts, invitationsQuantity, isContactExistById }
}
