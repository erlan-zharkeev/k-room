import { useLiveQuery } from 'dexie-react-hooks'

import type { DbContactType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useContact = () => {
  const contactMap =
    useLiveQuery(async () => {
      const allContacts = await db.contacts.toArray()
      return allContacts.reduce<Record<string, DbContactType>>((acc, contact) => {
        acc[contact.id] = contact
        return acc
      }, {})
    }) ?? {}

  const contactInvitationsQuantity = () =>
    Object.values(contactMap).filter((data) => {
      const contact = data
      return contact.interaction === 'invite-received'
    }).length
  const getContact = (id: string) => contactMap[id]
  const isContactExist = (id: string) => Boolean(getContact(id))
  const getContacts = (ids: string[]) => Object.values(contactMap).filter((contact) => ids.includes(contact.id))

  return {
    contacts: Object.values(contactMap),
    contactInvitationsQuantity,
    isContactExist,
    getContact,
    getContacts
  }
}
