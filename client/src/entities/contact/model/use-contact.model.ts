import { isAcceptedContactInteraction, isInviteReceivedContactInteraction } from 'global-shared'
import { computed } from 'vue'

import type { ContactRecord } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<ContactRecord>(db.contacts)

export const useContact = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = contactStore
  const { items: contacts, itemMap: contactById, hasById } = contactStore.useIndexedList()
  const acceptedContacts = computed(() =>
    contacts.value.filter(({ interactionType }) => isAcceptedContactInteraction(interactionType))
  )
  const invitationsQuantity = computed(
    () => contacts.value.filter(({ interactionType }) => isInviteReceivedContactInteraction(interactionType)).length
  )

  return {
    contacts,
    contactById,
    acceptedContacts,
    invitationsQuantity,
    isContactExist: hasById,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
