import { DbMessage } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<DbMessage>(db.messages)

export const useMessage = () => {
  const { put, bulkPut, update, reset } = messageStore
  const messages = messageStore.use()

  const isExist = (id: string) => Boolean(messages?.some((c) => c.id === id))

  const getById = (id: string) => messages.find((message) => message.id === id)

  return {
    messages,
    isExist,
    getById,
    put,
    bulkPut,
    update,
    reset
  }
}
