import { computed } from 'vue'

import type { ContactRecordType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<ContactRecordType>(db.contacts)

export const useContact = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = contactStore
  const { items: contacts, getByIds, hasById } = contactStore.useIndexedList()
  const acceptedContacts = computed(() =>
    contacts.value.filter(({ interactionType }) => interactionType === 'invite-accepted')
  )
  const invitationsQuantity = computed(
    () => contacts.value.filter(({ interactionType }) => interactionType === 'invite-received').length
  )

  const isContactExist = hasById

  return {
    contacts,
    acceptedContacts,
    invitationsQuantity,
    isContactExist,
    getByIds,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
