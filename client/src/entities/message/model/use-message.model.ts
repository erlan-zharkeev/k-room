import type { DbMessageType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<DbMessageType>(db.messages)

export const useMessage = () => {
  const { bulkPut, mutate, put, remove, reset, update } = messageStore
  const messages = messageStore.use()

  const getById = (id: string) => messages.value.find((message) => message.id === id)
  const isExist = (id: string) => messages.value.some((message) => message.id === id)

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
