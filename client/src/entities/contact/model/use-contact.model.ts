import { computed } from 'vue'

import type { ContactRecord } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<ContactRecord>(db.contacts)

export const useContact = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = contactStore
  const { items: contacts, itemMap: contactById, hasById } = contactStore.useIndexedList()
  const acceptedContacts = computed(() =>
    contacts.value.filter(({ interactionType }) => interactionType === 'invite-accepted')
  )
  const invitationsQuantity = computed(
    () => contacts.value.filter(({ interactionType }) => interactionType === 'invite-received').length
  )

  const isContactExist = hasById

  return {
    contacts,
    contactById,
    acceptedContacts,
    invitationsQuantity,
    isContactExist,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
