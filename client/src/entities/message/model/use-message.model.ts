import { computed } from 'vue'

import type { MessageRecordType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<MessageRecordType>(db.messages)

export const useMessage = () => {
  const { bulkDelete, bulkPut, bulkUpdate, mutate, put, remove, reset, update } = messageStore
  const messages = messageStore.use()
  const messageById = computed(() => new Map(messages.value.map((message) => [message.id, message])))

  const getById = (id: string) => messageById.value.get(id)
  const isExist = (id: string) => messageById.value.has(id)

  return {
    messages,
    messageById,
    getById,
    isExist,
    put,
    bulkPut,
    bulkUpdate,
    bulkDelete,
    update,
    mutate,
    remove,
    reset
  }
}
