import { computed } from 'vue'

import type { DbContactType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<DbContactType>(db.contacts)

export const useContact = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = contactStore
  const contacts = contactStore.use()
  const contactMap = computed(() => new Map(contacts.value.map((contact) => [contact.id, contact])))
  const acceptedContacts = computed(() =>
    contacts.value.filter(({ interactionType }) => interactionType === 'invite-accepted')
  )
  const invitationsQuantity = computed(
    () => contacts.value.filter(({ interactionType }) => interactionType === 'invite-received').length
  )

  const getByIds = (ids: string[]) => ids.flatMap((id) => contactMap.value.get(id) ?? [])
  const isContactExist = (id: string) => Boolean(contactMap.value.get(id))

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
