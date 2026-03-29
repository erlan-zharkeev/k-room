import { useLiveQuery } from 'dexie-react-hooks'

import type { DbMessageType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useMessage = () => {
  const messages =
    useLiveQuery(async () => {
      return await (db.messages.toArray() as Promise<DbMessageType[]>)
    }, []) ?? []

  const isMessageExist = (id: string) => Boolean(messages?.some((c) => c.id === id))

  const getMessageById = (id: string) => messages.find((message) => message.id === id)

  const putMessage = async (payload: DbMessageType) => await db.messages.put(payload)

  const bulkPutMessages = async (payload: DbMessageType[]) => {
    await db.messages.bulkPut(payload)
  }

  const updateMessage = async (id: string, patch: Partial<DbMessageType>) => {
    await db.messages.update(id, patch)
  }

  const reset = () => db.messages.clear()

  return {
    messages,
    isMessageExist,
    getMessageById,
    putMessage,
    bulkPutMessages,
    updateMessage,
    reset
  }
}
