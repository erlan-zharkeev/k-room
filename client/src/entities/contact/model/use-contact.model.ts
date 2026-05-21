import { computed } from 'vue'

import type { DbContactType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { isUserContact } from '../lib/is-user-contact'

const contactStore = dexieCollectionStore<DbContactType>(db.contacts)

export const useContact = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = contactStore
  const contacts = contactStore.use()
  const contactMap = computed(() => new Map(contacts.value.map((contact) => [contact.id, contact])))
  const userContacts = computed(() => contacts.value.filter(isUserContact))
  const acceptedContacts = computed(() =>
    userContacts.value.filter(({ interactionType }) => interactionType === 'invite-accepted')
  )
  const invitationsQuantity = computed(
    () => userContacts.value.filter(({ interactionType }) => interactionType === 'invite-received').length
  )

  const getByIds = (ids: string[]) => ids.flatMap((id) => contactMap.value.get(id) ?? [])
  const getUserContactsByIds = (ids: string[]) => getByIds(ids).filter(isUserContact)
  const isUserContactExist = (id: string) => {
    const contact = contactMap.value.get(id)

    return Boolean(contact && isUserContact(contact))
  }

  return {
    contacts,
    userContacts,
    acceptedContacts,
    invitationsQuantity,
    isUserContact,
    isUserContactExist,
    getByIds,
    getUserContactsByIds,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
