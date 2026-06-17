import type { Message } from 'global-shared'

import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<Message>(db.messages)

export const useMessage = () => {
  const { bulkDelete, bulkPut, bulkUpdate, mutate, put, remove, reset, update } = messageStore
  const { items: messages, itemMap: messageById, hasById: isExist } = messageStore.useIndexedList()

  const getById = (id: string) => messageById.value.get(id)

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
