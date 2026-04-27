import { computed } from 'vue'

import type { DbMessageType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<DbMessageType>(db.messages)

export const useMessage = () => {
  const { bulkPut, mutate, put, remove, reset, update } = messageStore
  const messages = messageStore.use()
  const messageMap = computed(() => new Map(messages.value.map((message) => [message.id, message])))

  const getById = (id: string) => messageMap.value.get(id)
  const isExist = (id: string) => messageMap.value.has(id)

  return {
    messages,
    getById,
    isExist,
    put,
    bulkPut,
    update,
    mutate,
    remove,
    reset
  }
}
