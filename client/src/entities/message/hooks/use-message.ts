import { DbMessageType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<DbMessageType>(db.messages)

export const useMessage = () => {
  const messages = messageStore.use()

  const isExist = (id: string) => Boolean(messages?.some((c) => c.id === id))

  const getById = (id: string) => messages.find((message) => message.id === id)

  return {
    messages,
    isExist,
    getById,
    put: (payload: DbMessageType) => messageStore.put(payload),
    bulkPut: (payload: DbMessageType[]) => messageStore.bulkPut(payload),
    update: (id: string, patch: Partial<DbMessageType>) => messageStore.update(id, patch),
    reset: () => messageStore.reset()
  }
}
